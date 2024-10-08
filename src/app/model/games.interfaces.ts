export interface Cover {
  id: string;
  url?: string;
  width?: number;
  height?: number;
  image_id?: string;
}

export interface GameGenre {
  id: number;
  name: string;
}

export interface GameCompany {
  id: number;
  name: string;
}

export interface InvolvedGameCompany {
  id: number;
  company: GameCompany;
  developer: boolean;
}

export interface GamePlatformLogo {
  id: number;
  url: string;
}

export interface GamePlatform {
  id: number;
  name: string;
  platform_logo: GamePlatformLogo;
}

export interface GameMode {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  name: string;
  cover: Cover;
  alternative_name?: string;
  game?: number;
  published_at?: number;
  summary?: string;
  first_release_date?: number;
  genres?: GameGenre[];
  involved_companies?: InvolvedGameCompany[];
  platforms?: GamePlatform[];
  total_rating?: number;
  game_modes?: GameMode[];
}

export interface Rating {
  score: number;
  total: number;
}

export interface UserGame extends Game {
  rating: Rating;
  note: string;
}

// TODO: Replace with User
export interface ListOwner {
  name: string;
  id: string;
}

type GameListType = 'default' | 'user';

export interface GameListRanking {
  ranked: boolean;
  order: number[]; // Game ids in ranked order
}

export interface GameList {
  name: string;
  id: string;
  owner: ListOwner; // TODO: Change to User
  type: GameListType;
  ranked: boolean;
  games: number[];
}
