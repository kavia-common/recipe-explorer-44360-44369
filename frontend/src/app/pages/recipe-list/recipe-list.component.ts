import { Component, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { Subscription, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

/**
 * PUBLIC_INTERFACE
 * RecipeListComponent shows a search bar and a grid of recipe cards.
 */
@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RecipeCardComponent],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);
  private search$ = new Subject<string>();
  private subs = new Subscription();

  recipes = signal<Recipe[]>([]);
  loading = signal(false);
  query = signal('');

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.recipes();
    return this.recipes().filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.toLowerCase().includes(q))
    );
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.subs.add(
      this.recipeService.getRecipes().subscribe({
        next: (list) => { this.recipes.set(list); this.loading.set(false); },
        error: () => this.loading.set(false)
      })
    );
    this.subs.add(
      this.search$.pipe(debounceTime(250), distinctUntilChanged())
        .subscribe(q => this.query.set(q))
    );
  }

  onSearchChange(value: string) {
    this.search$.next(value);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
