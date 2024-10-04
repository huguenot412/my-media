import { Component, inject, input, signal } from '@angular/core';
import { GameListsStore } from '../../store/game-lists.store';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameList } from '../../model/games.interfaces';
import { GameListItemComponent } from '../game-list-item/game-list-item.component';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [FontAwesomeModule, GameListItemComponent],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss',
})
export class GameListComponent {
  list = input.required<GameList>();
  gameListsStore = inject(GameListsStore);
  // Add ranked as property to list metadata
  rankedView = signal(false);
  faTrash = faTrash;
  detailView = input<boolean>(false);

  toggleRankedView(): void {
    this.rankedView.set(!this.rankedView());
  }

  deleteList(listId: string): void {
    this.gameListsStore.deleteList(listId);
  }
}
