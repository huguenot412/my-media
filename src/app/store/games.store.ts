import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import {
  addEntities,
  addEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Game, UserGame } from '../model/games.interfaces';

export const GamesStore = signalStore(
  { providedIn: 'root' },
  withEntities<UserGame>(),
  withMethods((store) => ({
    addGame(game: Game, listId: string): void {
      if (store.entityMap()[game.id]) {
        patchState(
          store,
          updateEntity({
            id: game.id,
            changes: { lists: [...store.entityMap()[game.id].lists, listId] },
          })
        );
      } else {
        const userGame: UserGame = {
          ...game,
          lists: [listId],
          rating: { score: 0, total: 5 },
          note: '',
        };

        patchState(store, addEntity(userGame));
      }
    },
    removeGameFromList(gameId: number, listId: string): void {
      patchState(
        store,
        updateEntity({
          id: gameId,
          changes: {
            lists: [
              ...store
                .entityMap()
                [gameId].lists.filter((list) => list !== listId),
            ],
          },
        })
      );
    },
    updateGameRating(id: number, score: number): void {
      patchState(
        store,
        updateEntity({
          id,
          changes: {
            rating: {
              ...store.entityMap()[id].rating,
              score,
            },
          },
        })
      );
    },
    updateGameNote(id: number, note: string): void {
      patchState(
        store,
        updateEntity({
          id,
          changes: {
            note,
          },
        })
      );

      console.log(store.entities());
    },
  }))
);
