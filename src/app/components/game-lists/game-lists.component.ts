import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameListsStore } from '../../store/game-lists.store';
import { GameListMetadata } from '../../model/games.interfaces';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { RatingComponent } from '../rating/rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameListComponent } from '../game-list/game-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-game-lists',
  standalone: true,
  imports: [
    FormsModule,
    SearchComponent,
    RouterLink,
    RatingComponent,
    FontAwesomeModule,
    GameListComponent,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './game-lists.component.html',
  styleUrl: './game-lists.component.scss',
})
export class GameListsComponent {
  gameListsStore = inject(GameListsStore);
  newListName = '';
  detailView = signal(false);

  addList(name: string): void {
    const list: GameListMetadata = {
      name,
      id: name.toLowerCase(),
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
      type: 'user',
      ranking: {
        ranked: false,
        order: [],
      },
    };

    this.gameListsStore.addList(list);
  }

  toggleDetailView(): void {
    this.detailView.set(!this.detailView());
  }
}
