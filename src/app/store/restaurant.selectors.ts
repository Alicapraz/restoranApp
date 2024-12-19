import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RestaurantState } from './restaurant.reducer';

export const selectRestaurantState = createFeatureSelector<RestaurantState>('restaurant');

export const selectSearchTerm = createSelector(
  selectRestaurantState,
  (state: RestaurantState) => state.searchTerm
);

export const selectFilteredRestaurants = createSelector(
    selectRestaurantState,
    (state: RestaurantState) => state.restaurants.filter(restaurant =>
      restaurant.title.toLowerCase().includes(state.searchTerm.toLowerCase())
    )
  );
  
