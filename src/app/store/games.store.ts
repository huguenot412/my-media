import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { addEntity, updateEntity, withEntities } from '@ngrx/signals/entities';
import { Game, UserGame } from '../model/games.interfaces';

export const GamesStore = signalStore(
  { providedIn: 'root' },
  withEntities<UserGame>(),
  withMethods((store) => ({
    addGame(game: Game): void {
      if (store.entityMap()[game.id]) {
        return;
      } else {
        const userGame: UserGame = {
          id: game.id,
          name: game.name,
          cover: game.cover,
          rating: { score: 0, total: 5 },
          note: '',
        };

        patchState(store, addEntity(userGame));
      }
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
    },
  }))
);
