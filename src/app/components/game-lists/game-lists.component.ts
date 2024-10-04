import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameListsStore } from '../../store/game-lists.store';
import { GameListMetadata } from '../../model/games.interfaces';
import { FormsModule } from '@angular/forms';
import { GamesStore } from '../../store/games.store';
import { SearchComponent } from '../search/search.component';
import { RatingComponent } from '../rating/rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { GameListItemComponent } from '../game-list-item/game-list-item.component';

@Component({
  selector: 'app-game-lists',
  standalone: true,
  imports: [
    FormsModule,
    SearchComponent,
    RouterLink,
    RatingComponent,
    FontAwesomeModule,
    GameListItemComponent,
  ],
  templateUrl: './game-lists.component.html',
  styleUrl: './game-lists.component.scss',
})
export class GameListsComponent {
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  newListName = '';
  faTrash = faTrash;
  detailView = signal(false);
  // Add ranked as property to list metadata
  rankedView = signal(false);

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

  toggleDetailView(): void {
    this.detailView.set(!this.detailView());
  }

  toggleRankedView(): void {
    this.rankedView.set(!this.rankedView());
  }
}
