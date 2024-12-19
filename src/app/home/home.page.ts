import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  address!:any;
  
constructor(private restaurantService:RestaurantService){
}
  ngOnInit(): void {
    this.address = this.restaurantService.getCurrentLocation();
  }  
}
