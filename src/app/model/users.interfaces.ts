import { GameList, UserGame } from './games.interfaces';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  games: UserGame[];
  gameLists: GameList[];
  friendIds: number[];
}
