import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { GameList } from '../model/games.interfaces';
import { computed } from '@angular/core';
import {
  addEntities,
  addEntity,
  removeEntity,
  setAllEntities,
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
  withEntities<GameList>(),
  withState(initialState),
  withComputed(({ entities }) => ({
    userCreatedLists: computed(() =>
      entities().filter((list) => list.type === 'user')
    ),
    defaultLists: computed(() =>
      entities().filter((list) => list.type === 'default')
    ),
  })),
  withMethods((store) => {
    return {
      setLists(lists: GameList[]): void {
        patchState(store, setAllEntities(lists));
      },
      addGameLists(lists: GameList[]): void {
        patchState(store, addEntities(lists));
      },
      addList(list: GameList): void {
        patchState(store, addEntity(list));
      },
      deleteList(listId: string): void {
        patchState(store, removeEntity(listId));
      },
      addGameToList(listId: string, gameId: number): void {
        patchState(
          store,
          updateEntity({
            id: listId,
            changes: {
              games: [...store.entityMap()[listId].games, gameId],
              lastUpdated: JSON.stringify(new Date()),
            },
          })
        );
      },
      // Used for updating game order after drag and drop
      updateListGames(listId: string, gameIds: number[]): void {
        patchState(
          store,
          updateEntity({
            id: listId,
            changes: {
              games: gameIds,
              lastUpdated: JSON.stringify(new Date()),
            },
          })
        );
      },
      removeGameFromList(listId: string, gameId: number): void {
        const games = [...store.entityMap()[listId].games];
        const gameIndex = games.findIndex((game) => game === gameId);
        games.splice(gameIndex, 1);

        patchState(
          store,
          updateEntity({
            id: listId,
            changes: {
              games,
              lastUpdated: JSON.stringify(new Date()),
            },
          })
        );
      },
      setRanked(id: string, ranked: boolean): void {
        patchState(
          store,
          updateEntity({
            id,
            changes: {
              ranked,
              lastUpdated: JSON.stringify(new Date()),
            },
          })
        );
      },
      addGroupTag(listId: string, name: string): void {
        patchState(
          store,
          updateEntity({
            id: listId,
            changes: {
              groups: [...store.entityMap()[listId].groups, name],
            },
          })
        );
      },
      removeGroupTag(listId: string, name: string): void {
        patchState(
          store,
          updateEntity({
            id: listId,
            changes: {
              groups: [
                ...store
                  .entityMap()
                  [listId].groups.filter((group) => group !== name),
              ],
            },
          })
        );
      },
    };
  })
);
