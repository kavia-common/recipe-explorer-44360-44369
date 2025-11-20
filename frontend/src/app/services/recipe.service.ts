import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, of, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { API_BASE } from '../core/env';

/**
 * PUBLIC_INTERFACE
 * RecipeService provides methods to fetch and search recipes.
 * It uses a backend API when NG_APP_API_BASE or NG_APP_BACKEND_URL is defined,
 * otherwise it falls back to an in-memory mock dataset.
 */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  private http = inject(HttpClient);

  private readonly mockRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Spaghetti Carbonara',
      description: 'Classic Roman pasta with eggs, cheese, pancetta, and pepper.',
      image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop',
      ingredients: [
        '200g spaghetti',
        '100g pancetta',
        '2 eggs',
        '50g Pecorino Romano',
        'Black pepper',
        'Salt'
      ],
      instructions: [
        'Cook spaghetti in salted boiling water.',
        'Fry pancetta until crisp.',
        'Whisk eggs with grated cheese and pepper.',
        'Toss hot pasta with pancetta, remove from heat.',
        'Quickly stir in egg-cheese mixture to create a creamy sauce.',
        'Serve immediately with extra cheese and pepper.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      servings: 2,
      tags: ['pasta', 'italian', 'quick']
    },
    {
      id: '2',
      name: 'Grilled Lemon Herb Chicken',
      description: 'Juicy grilled chicken marinated in lemon, garlic, and herbs.',
      image: 'https://images.unsplash.com/photo-1604909052743-94e05f2a4b8e?q=80&w=1200&auto=format&fit=crop',
      ingredients: [
        '2 chicken breasts',
        '2 lemons (zest and juice)',
        '2 cloves garlic',
        '2 tbsp olive oil',
        'Fresh thyme',
        'Salt and pepper'
      ],
      instructions: [
        'Mix lemon juice, zest, garlic, olive oil, thyme, salt, and pepper.',
        'Marinate chicken for at least 30 minutes.',
        'Grill over medium-high heat until cooked through.',
        'Rest for 5 minutes and serve.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 12,
      servings: 2,
      tags: ['grill', 'chicken', 'gluten-free']
    },
    {
      id: '3',
      name: 'Avocado Toast Deluxe',
      description: 'Creamy avocado on toasted sourdough with chili flakes and egg.',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop',
      ingredients: [
        '2 slices sourdough',
        '1 ripe avocado',
        '1 egg (optional)',
        'Chili flakes',
        'Lemon juice',
        'Salt and pepper'
      ],
      instructions: [
        'Toast sourdough.',
        'Mash avocado with lemon juice, salt, and pepper.',
        'Spread on toast, sprinkle chili flakes.',
        'Top with a fried or poached egg if desired.'
      ],
      prepTimeMinutes: 5,
      cookTimeMinutes: 5,
      servings: 1,
      tags: ['breakfast', 'vegetarian', 'quick']
    }
  ];

  // PUBLIC_INTERFACE
  /** Returns all recipes from API or mock dataset. */
  getRecipes(): Observable<Recipe[]> {
    if (API_BASE) {
      return this.http.get<Recipe[]>(`${API_BASE}/recipes`);
    }
    // mock fallback with slight delay to simulate network
    return of(this.mockRecipes).pipe(delay(200));
  }

  // PUBLIC_INTERFACE
  /** Returns a single recipe by id. */
  getRecipeById(id: string): Observable<Recipe | undefined> {
    if (API_BASE) {
      return this.http.get<Recipe>(`${API_BASE}/recipes/${id}`);
    }
    return of(this.mockRecipes.find(r => r.id === id)).pipe(delay(150));
  }

  // PUBLIC_INTERFACE
  /** Client-side search by name or ingredient; when API exists, attempt backend search with fallback to filter. */
  searchRecipes(query: string): Observable<Recipe[]> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return this.getRecipes();
    }
    if (API_BASE) {
      // Try backend search then fallback to local filtering if needed.
      return this.http
        .get<Recipe[]>(`${API_BASE}/recipes`, { params: { q } })
        .pipe(
          switchMap(apiList => {
            if (Array.isArray(apiList)) return of(apiList);
            return this.getRecipes();
          })
        );
    }
    return this.getRecipes().pipe(
      map(list =>
        list.filter(r =>
          r.name.toLowerCase().includes(q) ||
          r.ingredients.some(i => i.toLowerCase().includes(q))
        )
      )
    );
  }
}
