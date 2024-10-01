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
  published_at: number;
  cover: Cover;
}
