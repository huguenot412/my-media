import { Component, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

interface NavLink {
  displayName: string;
  path: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatListModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  links = signal<NavLink[]>([
    {
      displayName: 'Game lists',
      path: 'game-lists',
    },
    {
      displayName: 'Book lists',
      path: 'book-lists',
    },
    {
      displayName: 'Film/TV lists',
      path: 'show-lists',
    },
    {
      displayName: 'Friend activity',
      path: 'feed',
    },
    {
      displayName: 'Recommendations',
      path: 'recommendations',
    },
  ]);
}
