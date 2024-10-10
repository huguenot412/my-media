import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameListsStore } from '../../store/game-lists.store';
import { GameList } from '../../model/games.interfaces';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { RatingComponent } from '../rating/rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameListComponent } from '../game-list/game-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { JsonPipe } from '@angular/common';
import { UserService } from '../../services/users.service';
import { UserStore } from '../../store/user.store';
import { User } from '../../model/users.interfaces';

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
    ScrollingModule,
    MatButtonToggleModule,
    JsonPipe,
  ],
  templateUrl: './game-lists.component.html',
  styleUrl: './game-lists.component.scss',
})
export class GameListsComponent {
  gameListsStore = inject(GameListsStore);
  userService = inject(UserService);
  userStore = inject(UserStore);
  newListName = '';
  detailView = signal(false);

  addList(name: string): void {
    const list: GameList = {
      name,
      id: name.toLowerCase(),
      type: 'user',
      ranked: false,
      games: [],
    };

    this.gameListsStore.addList(list);

    const update: Partial<User> = {
      gameLists: this.gameListsStore.entities(),
    };

    this.userService.updateUser(update);
  }

  toggleDetailView(): void {
    this.detailView.set(!this.detailView());
  }

  listTrackBy(index: number, list: GameList): string {
    return list.id;
  }
}
