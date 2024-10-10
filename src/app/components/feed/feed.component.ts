import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/users.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FriendRequest, User } from '../../model/users.interfaces';
import { UserSelectComponent } from '../user-select/user-select.component';

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
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  userService = inject(UserService);
  pendingFriendRequestsSent: Signal<FriendRequest[] | undefined>;
  pendingFriendRequestsReceived: Signal<FriendRequest[] | undefined>;
  friend = signal<User | null>(null);

  constructor() {
    this.pendingFriendRequestsSent = toSignal(
      this.userService.getPendingFriendRequestsSent()
    );
    this.pendingFriendRequestsReceived = toSignal(
      this.userService.getPendingFriendRequestsReceived()
    );
  }

  ngOnInit(): void {}

  sendFriendRequest(): void {
    if (this.friend() && this.friend()?.id) {
      this.userService.sendFriendRequest(
        this.friend()!.id!,
        this.friend()!.username
      );
    }
  }

  acceptFriendRequest(friendRequestId: string): void {
    const update: Partial<FriendRequest> = {
      status: 'accepted',
      timeAcknowledged: JSON.stringify(new Date()),
    };
    this.userService.updateFriendRequest(friendRequestId, update);

    // TODO: Add friends to friend lists once request has been accepted
  }

  denyFriendRequest(friendRequestId: string): void {
    const update: Partial<FriendRequest> = {
      status: 'denied',
      timeAcknowledged: JSON.stringify(new Date()),
    };
    this.userService.updateFriendRequest(friendRequestId, update);
  }
}
