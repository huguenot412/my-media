import {
  Component,
  computed,
  inject,
  Input,
  input,
  signal,
} from '@angular/core';
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
  userId = input<string | undefined>(undefined);
  friendId = input('');
  editable = computed(() => (this.friendId() ? false : true));
  gameListsStore = inject(GameListsStore);
  userService = inject(UserService);
  userStore = inject(UserStore);
  newListName = '';
  detailView = signal(false);
  scrollView = signal(true);
  listsToDisplay = computed(() => {
    if (this.friendId()) {
      return this.userStore.friendsEntityMap()[this.friendId()].gameLists;
    } else if (this.userId()) {
      return this.gameListsStore.entities();
    } else return [];
  });
  listOwner = computed(() => {
    if (this.friendId()) {
      return this.userStore.friendsEntityMap()[this.friendId()];
    } else {
      return this.userStore.user()!;
    }
  });

  addList(name: string): void {
    if (!this.editable()) return;

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
