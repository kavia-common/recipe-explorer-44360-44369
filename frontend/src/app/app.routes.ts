import { Routes } from '@angular/router';
import { RecipeListComponent } from './pages/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './pages/recipe-detail/recipe-detail.component';

export const routes: Routes = [
  { path: '', component: RecipeListComponent, title: 'Recipes · Recipe Explorer' },
  { path: 'recipe/:id', component: RecipeDetailComponent, title: 'Recipe Details · Recipe Explorer' },
  { path: '**', redirectTo: '' }
];
