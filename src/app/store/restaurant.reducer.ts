import { createReducer, on } from '@ngrx/store';
import { loadRestaurants, updateSearchTerm } from './restaurant.actions';

export interface RestaurantState {
  restaurants: any[];
  searchTerm: string;
}

export const initialState: RestaurantState = {
  restaurants: [],
  searchTerm: ''
};

export const restaurantReducer = createReducer(
  initialState,

  on(updateSearchTerm, (state, { searchTerm }) => {
    console.log('Updated Search Term:', searchTerm);  
    return { 
      ...state, 
      searchTerm,
      restaurants: [] 
    };
  })
  
  ,
  
  on(loadRestaurants, (state, { restaurants }) => {
    console.log('restaurant:', restaurants);
    return { 
      ...state, 
      restaurants: [...state.restaurants, ...restaurants] 
    };
  })
  
)
;
