import { Component, computed, inject, input, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Game, GameList } from '../../model/games.interfaces';
import { GamesService } from '../../services/games.service';
import { GameListsStore } from '../../store/game-lists.store';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

type ListSelectMode = 'add' | 'move';
type ListSelectOptions = 'all' | 'user' | 'default';

@Component({
  selector: 'app-list-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonToggleModule],
  templateUrl: './list-select.component.html',
  styleUrl: './list-select.component.scss',
})
export class ListSelectComponent {
  game = input.required<Game>();
  listId = input<string | null>(null);
  gamesService = inject(GamesService);
  gameListsStore = inject(GameListsStore);
  mode = signal<ListSelectMode>('add');
  showModeToggle = input<boolean>(false);
  showLists = input<ListSelectOptions>('all');
  listsToShow = computed<GameList[]>(() => {
    if (this.showLists() === 'all') {
      return this.gameListsStore
        .entities()
        .filter((list) => list.id !== this.listId());
    } else if (this.showLists() === 'user') {
      return this.gameListsStore
        .userCreatedLists()
        .filter((list) => list.id !== this.listId());
    } else {
      return this.gameListsStore
        .defaultLists()
        .filter((list) => list.id !== this.listId());
    }
  });

  addGame(listId: string): void {
    this.gamesService.addGame(this.game(), listId);
  }

  moveGame(moveFromListId: string, moveToListId: string): void {
    this.addGame(moveToListId);
    this.gamesService.deleteGameFromList(this.game().id, moveFromListId);
  }

  handleListSelect(moveToListId: string): void {
    if (this.mode() === 'add') {
      this.addGame(moveToListId);
    }

    if (this.mode() === 'move' && this.listId()) {
      this.moveGame(this.listId()!, moveToListId);
    }
  }
}
