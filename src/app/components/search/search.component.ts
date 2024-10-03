import { Component, OnInit, inject, signal } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { Game } from '../../model/games.interfaces';
import { FormsModule } from '@angular/forms';
import { GameListsStore } from '../../store/game-lists.store';
import { GamesStore } from '../../store/games.store';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, FormsModule, NgOptimizedImage],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnDestroy {
  gamesService = inject(GamesService);
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  searchQuery = '';
  searchResults$: Observable<Game[]> = of([]);
  searchSubject$ = new Subject<void>();
  searchSubjectSub!: Subscription;

  constructor() {
    this.searchSubjectSub = this.searchSubject$
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.searchResults$ = this.gamesService.getGamesByName(
          this.searchQuery
        );
      });
  }

  searchGamesByName(): void {
    if (!this.searchQuery) return;

    this.searchResults$ = this.gamesService.getGamesByName(this.searchQuery);
  }

  addGame(game: Game, listId: string): void {
    this.gamesStore.addGame(game, listId);
  }

  onInputChange(): void {
    this.searchSubject$.next();
  }

  ngOnDestroy(): void {
    this.searchSubjectSub.unsubscribe();
  }
}
