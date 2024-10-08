import { Component, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { UserSelectComponent } from '../user-select/user-select.component';

interface NavLink {
  displayName: string;
  path: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatListModule, RouterLink, UserSelectComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  links = signal<NavLink[]>([
    {
      displayName: 'Login',
      path: 'login',
    },
    {
      displayName: 'Games',
      path: 'game-lists',
    },
    {
      displayName: 'Books',
      path: 'book-lists',
    },
    {
      displayName: 'Film/TV',
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
