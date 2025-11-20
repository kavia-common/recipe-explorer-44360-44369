import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipeService]
    });
    service = TestBed.inject(RecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRecipes should return items (mock fallback)', (done) => {
    service.getRecipes().subscribe(list => {
      expect(Array.isArray(list)).toBeTrue();
      expect(list.length).toBeGreaterThan(0);
      done();
    });
  });

  it('searchRecipes should filter by name or ingredient', (done) => {
    service.searchRecipes('chicken').subscribe(list => {
      const names = list.map(i => i.name.toLowerCase()).join(' ');
      const ingredients = list.flatMap(i => i.ingredients.map(j => j.toLowerCase())).join(' ');
      expect(names.includes('chicken') || ingredients.includes('chicken')).toBeTrue();
      done();
    });
  });
});
