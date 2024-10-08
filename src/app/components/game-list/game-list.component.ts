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

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    FontAwesomeModule,
    GameListItemComponent,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss',
})
export class GameListComponent {
  list = input.required<GameList>();
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  rankedView = input.required<boolean>();
  detailView = input<boolean>(false);
  faTrash = faTrash;
  faGripLinesVertical = faGripLinesVertical;
  games = computed(() => {
    return this.list().games.map(
      (gameId) => this.gamesStore.entityMap()[gameId]
    );
  });

  toggleRankedView(): void {
    this.gameListsStore.setRanked(this.list().id, !this.rankedView());
  }

  deleteList(listId: string): void {
    this.gameListsStore.deleteList(listId);
  }

  onDrop(event: CdkDragDrop<UserGame[]>): void {
    moveItemInArray(this.list().games, event.previousIndex, event.currentIndex);
    this.gameListsStore.updateListGames(this.list().id, this.list().games);
  }
}
