import { GameList, UserGame } from './games.interfaces';

export interface UserConfig {
  firstName: string;
  lastName: string;
  username: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  games: UserGame[];
  gameLists: GameList[];
  friendIds: number[];
}
