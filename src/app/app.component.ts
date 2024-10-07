import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { GameListsStore } from './store/game-lists.store';
import { GameListMetadata } from './model/games.interfaces';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatListModule, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  router = inject(Router);
  gameListsStore = inject(GameListsStore);
  title = 'my-media';
  defaultGameLists: GameListMetadata[] = [
    {
      name: 'Played',
      id: 'played',
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
      type: 'default',
      ranking: {
        ranked: false,
        order: [],
      },
    },
    {
      name: 'Playing',
      id: 'playing',
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
      type: 'default',
      ranking: {
        ranked: false,
        order: [],
      },
    },
    {
      name: 'Backlog',
      id: 'backlog',
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
      type: 'default',
      ranking: {
        ranked: false,
        order: [],
      },
    },
  ];

  ngOnInit(): void {
    this.gameListsStore.addGameLists(this.defaultGameLists);

    // if (!localStorage.getItem('activeUser')) {
    //   this.router.navigate(['/login']);
    // }
  }
}
