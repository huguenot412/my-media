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
import { Friend, User } from '../model/users.interfaces';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { GameList } from '../model/games.interfaces';
import { MatChipInputEvent } from '@angular/material/chips';

type UserState = {
  userFromApi: User | null;
};

const initialState: UserState = {
  userFromApi: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities({ entity: type<User>(), collection: 'friends' }),
  withComputed(({ userFromApi }) => {
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
    addGameListGroup(event: MatChipInputEvent): void {
      if (!store.userFromApi) return;

      const name = (event.value || '').trim();

      patchState(store, (state) => ({
        userFromApi: {
          ...state.userFromApi!,
          gameListGroups: [...state.userFromApi!.gameListGroups, name],
        },
      }));
    },
    removeGameListGroup(name: string): void {
      if (!store.userFromApi) return;

      patchState(store, (state) => ({
        userFromApi: {
          ...state.userFromApi!,
          gameListGroups: [
            ...state.userFromApi!.gameListGroups.filter(
              (group) => group !== name
            ),
          ],
        },
      }));
    },
  }))
);
