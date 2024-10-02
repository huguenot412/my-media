import { Component, OnInit, inject, signal } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { Game } from '../../model/games.interfaces';
import { FormsModule } from '@angular/forms';
import { GameListsStore } from '../../store/game-lists.store';
import { GamesStore } from '../../store/games.store';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, FormsModule, NgOptimizedImage],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  gamesService = inject(GamesService);
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  gameName = '';
  searchResults$: Observable<Game[]> = of([]);

  searchGamesByName(): void {
    this.searchResults$ = this.gamesService.getGamesByName(this.gameName);
  }

  addGame(game: Game, listId: string): void {
    this.gamesStore.addGame(game, listId);
  }
}
