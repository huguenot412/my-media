import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { GameList } from '../model/games.interfaces';
import { computed, inject } from '@angular/core';
import {
  addEntities,
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { User } from '../model/users.interfaces';
import { UsersService } from '../services/users.service';
import { GamesStore } from './games.store';

type GameListsState = {
  gameLists: GameList[];
  isLoaded: boolean;
  user: User | null;
  users: User[];
};

const initialState: GameListsState = {
  gameLists: [],
  isLoaded: false,
  user: null,
  users: [],
};

export const GameListsStore = signalStore(
  { providedIn: 'root' },
  withEntities<GameList>(),
  withState(initialState),
  withComputed(({ entities }) => ({
    userCreatedLists: computed(() =>
      entities().filter((list) => list.type === 'user')
    ),
  })),
  withMethods((store) => {
    const usersService = inject(UsersService);
    const gamesStore = inject(GamesStore);

    return {
      setUser(user: User): void {
        patchState(store, () => ({
          user,
        }));
      },
      setUserToNull(): void {
        patchState(store, () => ({
          user: null,
        }));
      },
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
            changes: { games: [...store.entityMap()[listId].games, gameId] },
          })
        );

        if (store.user()) {
          const update: Partial<User> = {
            gameLists: store.entities(),
            games: gamesStore.entities(),
          };

          usersService.updateUser(store.user()!.id, update);
        }
      },
      // Used for updating game order after drag and drop
      updateListGames(listId: string, gameIds: number[]): void {
        patchState(
          store,
          updateEntity({ id: listId, changes: { games: gameIds } })
        );
      },
      removeGameFromList(listId: string, gameId: number): void {
        patchState(
          store,
          updateEntity({
            id: listId,
            changes: {
              games: store
                .entityMap()
                [listId].games.filter((game) => game !== gameId),
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
            },
          })
        );
      },
    };
  })
);
