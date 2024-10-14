import { Component, computed, inject, input, signal } from '@angular/core';
import { GameListsStore } from '../../store/game-lists.store';
import {
  faGripLinesVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameList, UserGame } from '../../model/games.interfaces';
import { GameListItemComponent } from '../game-list-item/game-list-item.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GamesStore } from '../../store/games.store';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { User } from '../../model/users.interfaces';
import { UserService } from '../../services/users.service';
import { UserStore } from '../../store/user.store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    FontAwesomeModule,
    GameListItemComponent,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    ScrollingModule,
    MatButtonToggleModule,
    FormsModule,
    JsonPipe,
  ],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss',
})
export class GameListComponent {
  list = input.required<GameList>();
  listOwner = input.required<User>();
  editable = input(true);
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  userStore = inject(UserStore);
  userService = inject(UserService);
  rankedView = input.required<boolean>();
  detailView = input<boolean>(false);
  scrollView = input(true);
  faTrash = faTrash;
  faGripLinesVertical = faGripLinesVertical;
  games = computed(() => {
    return this.list().games.map(
      (gameId) =>
        this.listOwner().games.find((game) => game.id === gameId) as UserGame
    );
  });

  setRankedView(ranked: boolean): void {
    if (!this.editable()) return;

    this.gameListsStore.setRanked(this.list().id, ranked);

    const update: Partial<User> = {
      gameLists: this.gameListsStore.entities(),
    };

    this.userService.updateUser(update);
  }

  deleteList(listId: string): void {
    if (!this.editable()) return;

    this.gameListsStore.deleteList(listId);

    const update: Partial<User> = {
      gameLists: this.gameListsStore.entities(),
    };

    this.userService.updateUser(update);
  }

  onDrop(event: CdkDragDrop<UserGame[]>): void {
    if (!this.editable()) return;

    moveItemInArray(this.list().games, event.previousIndex, event.currentIndex);
    this.gameListsStore.updateListGames(this.list().id, this.list().games);

    const update: Partial<User> = {
      gameLists: this.gameListsStore.entities(),
      games: this.gamesStore.entities(),
    };

    this.userService.updateUser(update);
  }

  gamesTrackBy(index: number, game: UserGame): number {
    return game.id;
  }
}
