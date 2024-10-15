import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/users.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FriendRequest, User } from '../../model/users.interfaces';
import { UserSelectComponent } from '../user-select/user-select.component';
import { UserStore } from '../../store/user.store';
import { GameListsComponent } from '../game-lists/game-lists.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { RecommendationsComponent } from '../recommendations/recommendations.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatButtonModule,
    AsyncPipe,
    JsonPipe,
    UserSelectComponent,
    GameListsComponent,
    MatTabsModule,
    MatCardModule,
    RecommendationsComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent {
  userService = inject(UserService);
  userStore = inject(UserStore);
  user = inject(UserStore).user;
  pendingFriendRequestsSent: Signal<FriendRequest[] | undefined>;
  pendingFriendRequestsReceived: Signal<FriendRequest[] | undefined>;
  friends = this.userStore.friendsEntities;
  friend = signal<User | null>(null);

  constructor() {
    this.pendingFriendRequestsSent = toSignal(
      this.userService.getPendingFriendRequestsSent()
    );
    this.pendingFriendRequestsReceived = toSignal(
      this.userService.getPendingFriendRequestsReceived()
    );
  }

  sendFriendRequest(): void {
    if (this.friend() && this.friend()?.id) {
      this.userService.sendFriendRequest(
        this.friend()!.id!,
        this.friend()!.username
      );
    }
  }

  acceptFriendRequest(friendRequest: FriendRequest): void {
    const update: FriendRequest = {
      ...friendRequest,
      status: 'accepted',
      timeAcknowledged: JSON.stringify(new Date()),
    };

    this.userService.updateFriendRequest(friendRequest.id!, update);
    this.userService.getFriendIds();
  }

  denyFriendRequest(friendRequestId: string): void {
    const update: Partial<FriendRequest> = {
      status: 'denied',
      timeAcknowledged: JSON.stringify(new Date()),
    };
    this.userService.updateFriendRequest(friendRequestId, update);
  }
}
