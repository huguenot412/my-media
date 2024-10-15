import { Component, computed, inject, input, signal } from '@angular/core';
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
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ListGroupSelectComponent } from '../list-group-select/list-group-select.component';

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
    ListGroupSelectComponent,
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
  selectedListGroup = signal('all');
  listsToDisplay = computed(() => {
    if (this.friendId()) {
      if (this.selectedListGroup() === 'all') {
        return this.userStore.friendsEntityMap()[this.friendId()].gameLists;
      }

      return this.userStore
        .friendsEntityMap()
        [this.friendId()].gameLists.filter((list) =>
          list.groups.includes(this.selectedListGroup())
        );
    } else if (this.userId()) {
      if (this.selectedListGroup() === 'all') {
        return this.gameListsStore.entities();
      }

      return this.gameListsStore
        .entities()
        .filter((list) => list.groups.includes(this.selectedListGroup()));
    } else return [];
  });
  listOwner = computed(() => {
    if (this.friendId()) {
      return this.userStore.friendsEntityMap()[this.friendId()];
    } else {
      return this.userStore.user()!;
    }
  });

  addList(): void {
    if (!this.editable()) return;

    this.gameListsStore.addList(
      this.userService.createGameList(this.newListName, 'user')
    );
    this.userService.updateUser({
      gameLists: this.gameListsStore.entities(),
    });
  }

  addListGroup(name: string): void {
    if (!this.editable()) return;

    if (this.userStore.user()) {
      this.userStore.addGameListGroup(name);
      this.userService.updateUser({
        gameListGroups: this.userStore.user()!.gameListGroups,
      });
    }
  }

  deleteListGroup(name: string): void {
    if (!this.editable()) return;

    this.userService.removeGameListGroup(name);
  }

  toggleDetailView(): void {
    this.detailView.set(!this.detailView());
  }

  listTrackBy(index: number, list: GameList): string {
    return list.id;
  }
}
