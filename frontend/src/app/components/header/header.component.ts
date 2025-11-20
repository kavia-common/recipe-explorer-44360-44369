import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * HeaderComponent shows the app brand/title and acts as a top navigation bar.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title = 'Recipe Explorer';
}
