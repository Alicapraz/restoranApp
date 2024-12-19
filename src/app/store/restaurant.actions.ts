import { createAction, props } from '@ngrx/store';

export const updateSearchTerm = createAction(
  '[Restaurant] Arama Terimini Güncelle',
  props<{ searchTerm: string }>()
);

export const loadRestaurants = createAction(
  '[Restaurant] Restoranları Yükle',
  props<{ restaurants: any[] }>()
);
