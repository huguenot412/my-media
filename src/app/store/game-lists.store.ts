import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Game, GameList, GameListMetadata } from '../model/games.interfaces';
import { computed, inject } from '@angular/core';
import { GamesStore } from './games.store';
import {
  addEntities,
  addEntity,
  removeEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';

type GameListsState = {
  gameLists: GameList[];
  isLoaded: boolean;
};

const initialState: GameListsState = {
  gameLists: [],
  isLoaded: false,
};

export const GameListsStore = signalStore(
  { providedIn: 'root' },
  withEntities<GameListMetadata>(),
  withState(initialState),
  withComputed(({ entities, gameLists }) => {
    const gamesStore = inject(GamesStore);

    return {
      gameLists: computed(() => {
        const gameLists: GameList[] = entities().map((list) => ({
          ...list,
          games: gamesStore
            .entities()
            .filter((game) => game.lists.includes(list.id))
            .sort((a, b) => {
              const aRank = list.ranking.order.findIndex(
                (gameId) => gameId === a.id
              );
              const bRank = list.ranking.order.findIndex(
                (gameId) => gameId === b.id
              );

              return aRank - bRank;

              // if (aRank && bRank) {
              //   return aRank - bRank;
              // }

              // const aIndex = gamesStore
              //   .entities()
              //   .findIndex((game) => game.id === a.id);
              // const bIndex = gamesStore
              //   .entities()
              //   .findIndex((game) => game.id === b.id);

              // return aIndex - bIndex;
            }),
        }));

        return gameLists;
      }),
      userCreatedLists: computed(() =>
        gameLists().filter((list) => list.type === 'user')
      ),
    };
  }),
  withMethods((store) => ({
    addGameLists(lists: GameListMetadata[]): void {
      patchState(store, addEntities(lists));
    },
    addList(list: GameListMetadata): void {
      patchState(store, addEntity(list));
    },
    deleteList(listId: string): void {
      patchState(store, removeEntity(listId));
    },
    setRanked(id: string, ranked: boolean): void {
      const list = store.entityMap()[id];
      patchState(
        store,
        updateEntity({
          id,
          changes: {
            ranking: {
              ...list.ranking,
              ranked,
            },
          },
        })
      );
    },
    setRankingOrder(id: string, order: number[]) {
      const list = store.entityMap()[id];
      patchState(
        store,
        updateEntity({
          id,
          changes: {
            ranking: {
              ...list.ranking,
              order,
            },
          },
        })
      );
    },
    setRanking(id: string, ranked: boolean, order: number[]): void {
      patchState(
        store,
        updateEntity({
          id,
          changes: {
            ranking: {
              ranked,
              order,
            },
          },
        })
      );
    },
  }))
);
