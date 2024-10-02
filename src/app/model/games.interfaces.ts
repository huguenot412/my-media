export interface Cover {
  id: string;
  url?: string;
  width?: number;
  height?: number;
  image_id?: string;
}

export interface Game {
  id: number;
  alternative_name?: string;
  game?: number;
  name: string;
  published_at?: number;
  cover?: Cover;
}

export interface UserGame extends Game {
  lists: string[];
}

export interface ListOwner {
  name: string;
  id: string;
}

export interface GameListMetadata {
  name: string;
  id: string;
  owner: ListOwner;
}

export interface GameList extends GameListMetadata {
  games: Game[];
}
