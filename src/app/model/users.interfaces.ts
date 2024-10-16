import { GameList, UserGame } from './games.interfaces';

export interface UserConfig {
  firstName: string;
  lastName: string;
  username: string;
}

export interface ProtoUser {
  firstName: string;
  lastName: string;
  username: string;
  games: UserGame[];
  gameLists: GameList[];
  gameListGroups: string[];
}

export interface User extends ProtoUser {
  id: string;
}

type FriendRequestStatus = 'pending' | 'accepted' | 'denied' | 'completed';

export interface Friend {
  id: string;
  friendRequestId: string;
}

export interface FriendRequest {
  sentById: string; // User ID
  sentByUsername: string;
  sentToId: string; // User ID
  sentToUsername: string;
  timeSent: string; // Timestamp of when request was sent
  timeAcknowledged: string | null; // Timestamp of when request accepted or denied
  status: FriendRequestStatus;
  id?: string;
}
