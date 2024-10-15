import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { GamesStore } from './games.store';
import { computed, inject } from '@angular/core';
import { GameListsStore } from './game-lists.store';
import { User } from '../model/users.interfaces';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';

type UserState = {
  userFromApi: User | null;
  gameListGroups: string[];
};

const initialState: UserState = {
  userFromApi: null,
  gameListGroups: [],
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities({ entity: type<User>(), collection: 'friends' }),
  withComputed(({ userFromApi, gameListGroups }) => {
    const gamesStore = inject(GamesStore);
    const gameListsStore = inject(GameListsStore);

    return {
      user: computed<User | null>(() => {
        let localUser = userFromApi();

        if (localUser) {
          return {
            ...localUser,
            games: gamesStore.entities(),
            gameLists: gameListsStore.entities(),
            gameListGroups: gameListGroups(),
          };
        }

        return null;
      }),
    };
  }),
  withMethods((store) => ({
    setUser(user: User | null): void {
      patchState(store, () => ({
        userFromApi: user,
      }));
    },
    setFriends(friends: User[]): void {
      patchState(store, setAllEntities(friends, { collection: 'friends' }));
    },
    setGameListGroups(gameListGroups: string[]): void {
      patchState(store, () => ({
        gameListGroups,
      }));
    },
    addGameListGroup(name: string): void {
      patchState(store, (state) => ({
        gameListGroups: [...state.gameListGroups, name],
      }));
    },
    removeGameListGroup(name: string): void {
      patchState(store, (state) => ({
        gameListGroups: [
          ...state.gameListGroups.filter((group) => group !== name),
        ],
      }));
    },
  }))
);
