import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameListsStore } from '../../store/game-lists.store';
import { GameListMetadata } from '../../model/games.interfaces';
import { FormsModule } from '@angular/forms';
import { GamesStore } from '../../store/games.store';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-game-lists',
  standalone: true,
  imports: [FormsModule, SearchComponent, RouterLink],
  templateUrl: './game-lists.component.html',
  styleUrl: './game-lists.component.scss',
})
export class GameListsComponent {
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  newListName = '';

  addList(name: string): void {
    const list: GameListMetadata = {
      name,
      id: name.toLowerCase(),
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
      type: 'user',
    };

    this.gameListsStore.addList(list);
  }

  deleteList(listId: string): void {
    this.gameListsStore.deleteList(listId);
  }

  deleteGameFromList(gameId: number, listId: string): void {
    this.gamesStore.removeGameFromList(gameId, listId);
  }
}
