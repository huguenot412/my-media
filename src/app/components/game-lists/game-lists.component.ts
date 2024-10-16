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
import { MatChipsModule } from '@angular/material/chips';

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
    MatChipsModule,
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
  newListGroupName = '';
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

  addList(): void {
    if (!this.editable()) return;

    this.gameListsStore.addList(
      this.userService.createGameList(this.newListName, 'user')
    );
    this.userService.updateUser({
      gameLists: this.gameListsStore.entities(),
    });
  }

  // addListGroup(): void {
  //   if (!this.editable()) return;

  //   if (this.userStore.user()) {
  //     this.userStore.addGameListGroup(this.newListGroupName);
  //     this.userService.updateUser({
  //       gameListGroups: this.userStore.user()!.gameListGroups,
  //     });
  //   }
  // }

  toggleDetailView(): void {
    this.detailView.set(!this.detailView());
  }

  listTrackBy(index: number, list: GameList): string {
    return list.id;
  }

  // addGameListGroup(name: string) {
  //   this.userService.addGameListGroup(name);
  // }

  // removeGameListGroup(name: string): void {
  //   this.userService.removeGameListGroup(name);
  // }
}
