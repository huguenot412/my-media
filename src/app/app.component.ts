import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { GameListsComponent } from './components/game-lists/game-lists.component';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { GameListsStore } from './store/game-lists.store';
import { GameListMetadata } from './model/games.interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchComponent, GameListsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
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
    },
    {
      name: 'Playing',
      id: 'playing',
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
      type: 'default',
    },
    {
      name: 'Backlog',
      id: 'backlog',
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
      type: 'default',
    },
  ];

  ngOnInit(): void {
    this.gameListsStore.addGameLists(this.defaultGameLists);
  }
}
