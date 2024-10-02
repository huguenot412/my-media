import { Component, inject, OnInit } from '@angular/core';
import { GameListsStore } from '../../store/game-lists.store';
import { GameList, GameListMetadata } from '../../model/games.interfaces';
import { FormsModule } from '@angular/forms';
import { GamesStore } from '../../store/games.store';

const DEFAULT_GAME_LISTS: GameList[] = [
  {
    name: 'Played',
    games: [],
    id: 'played',
    owner: {
      name: 'Chris Snow',
      id: 'chris_snow',
    },
  },
  {
    name: 'Playing',
    games: [
      {
        name: "Marvel's Midnight Suns",
        id: Math.random(),
      },
      {
        name: 'Black Myth: Wukong',
        id: Math.random(),
      },
      {
        name: 'Mario + Rabbids: Kingdom Battle',
        id: Math.random(),
      },
    ],
    id: 'playing',
    owner: {
      name: 'Chris Snow',
      id: 'chris_snow',
    },
  },
  {
    name: 'Backlog',
    games: [],
    id: 'backlog',
    owner: {
      name: 'Chris Snow',
      id: 'chris_snow',
    },
  },
];

@Component({
  selector: 'app-game-lists',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './game-lists.component.html',
  styleUrl: './game-lists.component.scss',
})
export class GameListsComponent implements OnInit {
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  newListName = '';
  defaultGameLists: GameListMetadata[] = [
    {
      name: 'Played',
      id: 'played',
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
    },
    {
      name: 'Playing',
      id: 'playing',
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
    },
    {
      name: 'Backlog',
      id: 'backlog',
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
    },
  ];

  ngOnInit(): void {
    this.gameListsStore.addGameLists(this.defaultGameLists);
  }

  addList(name: string): void {
    const list: GameListMetadata = {
      name,
      id: name.toLowerCase(),
      owner: {
        name: 'Chris Snow',
        id: 'chris_snow',
      },
    };

    this.gameListsStore.addList(list);
  }

  deleteGameFromList(gameId: number, listId: string): void {
    this.gamesStore.removeGameFromList(gameId, listId);
  }
}
