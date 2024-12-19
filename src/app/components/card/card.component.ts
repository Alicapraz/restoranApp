import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RestaurantService } from 'src/app/services/restaurant.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { updateSearchTerm, loadRestaurants } from 'src/app/store/restaurant.actions';
import { selectFilteredRestaurants, selectSearchTerm } from 'src/app/store/restaurant.selectors';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {

  restaurants$: Observable<any[]> = this.store.select(selectFilteredRestaurants);
  searchTerm$: Observable<string> = this.store.select(selectSearchTerm);
  
  restaurants: any[] = [];  
  skip = 0;
  limit = 10;  
  latitude!:number; 
  longitude!:number;  
  favorites: Set<string> = new Set();

  constructor(private restaurantService: RestaurantService, private nav: NavController, private store: Store) {}

  ngOnInit() {
    this.skip = 0;
    this.restaurants$ = this.store.select(selectFilteredRestaurants);
    this.getLocationRestaurants();

  }

  loadRestaurants(event?: any) {
    if (this.latitude && this.longitude) {
      this.restaurantService
        .getRestaurants(this.latitude, this.longitude, this.skip, this.limit)
        .subscribe({
          next: (data) => {
            
            // this.store.dispatch(loadRestaurants({ restaurants: data.response }));

            const newRestaurants = data.response.map((restaurant: any) => {
              const distance = this.getDistanceFromLatLonInKm(
                this.latitude,
                this.longitude,
                restaurant.location.coordinates[1],
                restaurant.location.coordinates[0]
              );
              return { 
                ...restaurant, 
                distance: distance.toFixed(2) 
              };
            });
  
            
            this.restaurants = [...this.restaurants, ...newRestaurants];

            // this.store.dispatch(loadRestaurants({ restaurants: this.restaurants }));
            

            this.store.dispatch(loadRestaurants({ restaurants: newRestaurants }));
            
            if (newRestaurants.length < this.limit && event) {
              event.target.disabled = true;
            } else {
              
              this.skip += this.limit;
            }
  
            
            if (event) {
              event.target.complete();
            }
            this.store.dispatch(loadRestaurants({ restaurants: newRestaurants }));

          },
          error: (err) => {
            console.error('Veriler yüklenirken hata oluştu:', err);
            if (event) {
              event.target.complete();
            }
          },
        });
    }
  }
  
  // getLocationRestaurants() {
  //   this.restaurantService.getCurrentLocation().then((location) => {
  //     this.restaurantService
  //       .getRestaurants(location.latitude, location.longitude, this.skip, this.limit)
  //       .subscribe((data) => {
  //         this.store.dispatch(loadRestaurants({ restaurants: data }));
  //       });
  //   });
  // }
  

  getLocationRestaurants(){
    this.restaurantService.getCurrentLocation().then((location) => {
        this.latitude = location.latitude,
        this.longitude = location.longitude,
        this.loadRestaurants()
    });
  }



  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = this.deg2rad(lat2 - lat1);  
    const dLon = this.deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const d = R * c;
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }



  openDetail(id: string) {
    
    const restaurant = this.restaurants.find(r => r.id === id);
    this.nav.navigateForward(['/detail', id], { state: { restaurant } });
  }




  isFavorite(restaurant: any): boolean {
    return this.favorites.has(restaurant.id);
  }



  toggleFavorite(restaurant: any): void {
    if (this.isFavorite(restaurant)) {
      this.favorites.delete(restaurant.id);
    } else {
      this.favorites.add(restaurant.id);
    }
  }

  // onSearchChange(event: any) {
  //   const searchTerm = event.detail.value;
  //   console.log('Search Term:', searchTerm);  // Arama terimi burada doğrulanacak
  //   this.store.dispatch(updateSearchTerm({ searchTerm }));
  // }
  onSearchChange(event: any) {
    const searchTerm = event.target.value;
  
    // Search term'i store'da güncelle
    this.store.dispatch(updateSearchTerm({ searchTerm }));
  
    // Skip değerini sıfırla ve yeni sonuçları yükle
    this.skip = 0;
    this.loadRestaurants(searchTerm);
  }

}
