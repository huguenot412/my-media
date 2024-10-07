import { Component, inject, input, signal } from '@angular/core';
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
  rankedView = input.required<boolean>();
  detailView = input<boolean>(false);
  faTrash = faTrash;
  faGripLinesVertical = faGripLinesVertical;

  toggleRankedView(): void {
    this.gameListsStore.setRanked(this.list().id, !this.rankedView());
    this.setRankingOrder();
  }

  deleteList(listId: string): void {
    this.gameListsStore.deleteList(listId);
  }

  setRankingOrder(): void {
    const rankingOrder = this.list().games.map((game) => game.id);
    this.gameListsStore.setRankingOrder(this.list().id, rankingOrder);
  }

  onDrop(event: CdkDragDrop<UserGame[]>): void {
    moveItemInArray(this.list().games, event.previousIndex, event.currentIndex);
    this.setRankingOrder();
  }
}
