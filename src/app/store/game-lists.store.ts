import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Game, GameList, GameListMetadata } from '../model/games.interfaces';
import {
  addEntities,
  addEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { computed, inject } from '@angular/core';
import { GamesStore } from './games.store';

type GameListsState = {
  gameListsMetadata: GameListMetadata[];
  isLoaded: boolean;
};

const initialState: GameListsState = {
  gameListsMetadata: [],
  isLoaded: false,
};

export const GameListsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ gameListsMetadata }) => {
    const gamesStore = inject(GamesStore);

    return {
      gameLists: computed(() => {
        const gameLists: GameList[] = gameListsMetadata().map((list) => ({
          ...list,
          games: gamesStore
            .entities()
            .filter((game) => game.lists.includes(list.id)),
        }));

        return gameLists;
      }),
      userCreatedLists: computed(() =>
        gameListsMetadata().filter(
          (list) =>
            list.id !== 'played' &&
            list.id !== 'playing' &&
            list.id !== 'backlog'
        )
      ),
    };
  }),
  withMethods((store) => ({
    addGameLists(lists: GameListMetadata[]): void {
      patchState(store, {
        gameListsMetadata: [...store.gameListsMetadata(), ...lists],
      });

      console.log(store.gameLists());
    },
    addList(list: GameListMetadata): void {
      patchState(store, {
        gameListsMetadata: [...store.gameListsMetadata(), list],
      });
    },
  }))
);
