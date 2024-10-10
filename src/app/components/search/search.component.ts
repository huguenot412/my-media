import { Component, inject } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { Game } from '../../model/games.interfaces';
import { FormsModule } from '@angular/forms';
import { GameListsStore } from '../../store/game-lists.store';
import { GamesStore } from '../../store/games.store';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleInfo,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserStore } from '../../store/user.store';
import { UserService as UserService } from '../../services/users.service';
import { User } from '../../model/users.interfaces';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    RouterLink,
    FormsModule,
    NgOptimizedImage,
    FontAwesomeModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ScrollingModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnDestroy {
  gamesService = inject(GamesService);
  gameListsStore = inject(GameListsStore);
  userStore = inject(UserStore);
  gamesStore = inject(GamesStore);
  userService = inject(UserService);
  searchQuery = '';
  searchResults$: Observable<Game[]> = of([]);
  searchSubject$ = new Subject<void>();
  searchSubjectSub!: Subscription;
  faCircleInfo = faCircleInfo;
  faMagnifyingGlass = faMagnifyingGlass;

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
    this.gamesStore.addGame(game);
    this.gameListsStore.addGameToList(listId, game.id);

    const update: Partial<User> = {
      gameLists: this.gameListsStore.entities(),
      games: this.gamesStore.entities(),
    };

    this.userService.updateUser(update);
  }

  onInputChange(): void {
    this.searchSubject$.next();
  }

  ngOnDestroy(): void {
    this.searchSubjectSub.unsubscribe();
  }
}
