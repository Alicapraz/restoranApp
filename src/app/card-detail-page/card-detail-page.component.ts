import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../services/restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { restaurant } from '../restaurant-model';

@Component({
  selector: 'app-card-detail-page',
  templateUrl: './card-detail-page.component.html',
  styleUrls: ['./card-detail-page.component.scss'],
})
export class CardDetailPageComponent  implements OnInit {
  skip = 1;
  limit = 10;  
  latitude!:number; 
  longitude!:number;  
  restaurant!: restaurant;
  distance!: number; 
  favorites: Set<string> = new Set();
  restaurants: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private router: Router
  ) {}


  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { restaurant: restaurant };
    console.log(state);
  
    if (state && state.restaurant) {
      this.restaurant = state.restaurant;
    } else {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadRestaurantDetails(id);
        }
      });
    }
    this.getLocationRestaurants();
  }

  loadRestaurantDetails(id: string) {
    this.restaurantService.getRestaurants(this.latitude, this.longitude, this.skip, this.limit).subscribe(response => {
      this.restaurants = response;
    });
  }


  isRestaurantOpen(open: any, close: any): boolean {
    const currentTime = new Date();
  
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
  
    const [openingHour, openingMinute] = open.split(':').map(Number);
    const [closingHour, closingMinute] = close.split(':').map(Number);
  
    const isOpen =
      (currentHours > openingHour || (currentHours === openingHour && currentMinutes >= openingMinute)) &&
      (currentHours < closingHour || (currentHours === closingHour && currentMinutes < closingMinute));
    
    return isOpen;
    
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

  getLocationRestaurants(){
    this.restaurantService.getCurrentLocation().then((location) => {
        this.latitude = location.latitude,
        this.longitude = location.longitude,
        this.loadRestaurants()
    });
  }

  loadRestaurants(event?: any) {
    if (this.latitude && this.longitude) {
      this.restaurantService.getRestaurants(this.latitude, this.longitude, this.skip, this.limit).subscribe(data => {
        const newRestaurants = data.response.map((restaurant: any) => {
          const distance = this.getDistanceFromLatLonInKm(
            this.latitude, this.longitude, restaurant.location.coordinates[1], restaurant.location.coordinates[0],
          );
          return { ...restaurant, distance: distance.toFixed(2) };
        });
        this.restaurants = [...this.restaurants, ...newRestaurants];

        if (event) {
          event.target.complete();
        }

        if (newRestaurants.length < 10) {
          event.target.disabled = true;
        }

        
      });
    }
  }

  calculateDistance() {
    if (this.restaurant && this.latitude && this.longitude) {
      const coordinates = this.restaurant.location?.coordinates;
  
      if (coordinates && coordinates.length >= 2) {
        this.distance = this.getDistanceFromLatLonInKm(
          this.latitude,
          this.longitude,
          coordinates[0] ?? 0, 
          coordinates[0] ?? 0  
        );
      } else {
        console.error('Koordinatlar mevcut değil veya eksik.');
        this.distance = 0; 
      }
    } else {
      console.error('Restoran veya konum bilgisi eksik.');
      this.distance = 0; 
    }
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
  
}

