import { Component, computed, inject, input, signal } from '@angular/core';
import { GameListsStore } from '../../store/game-lists.store';
import {
  faGripLinesVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Game, GameList, UserGame } from '../../model/games.interfaces';
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
  ],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss',
})
export class GameListComponent {
  list = input.required<GameList>();
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  userStore = inject(UserStore);
  userService = inject(UserService);
  rankedView = input.required<boolean>();
  detailView = input<boolean>(false);
  scrollView = signal(true);
  faTrash = faTrash;
  faGripLinesVertical = faGripLinesVertical;
  games = computed(() => {
    return this.list().games.map(
      (gameId) => this.gamesStore.entityMap()[gameId]
    );
  });

  setRankedView(ranked: boolean): void {
    this.gameListsStore.setRanked(this.list().id, ranked);
  }

  toggleRankedView(): void {
    this.gameListsStore.setRanked(this.list().id, !this.rankedView());
  }

  deleteList(listId: string): void {
    this.gameListsStore.deleteList(listId);
  }

  onDrop(event: CdkDragDrop<UserGame[]>): void {
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
