import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { UserGame } from '../../model/games.interfaces';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { GamesStore } from '../../store/games.store';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-game-list-item',
  standalone: true,
  imports: [
    RouterLink,
    RatingComponent,
    FontAwesomeModule,
    FormsModule,
    NgOptimizedImage,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-list-item.component.html',
  styleUrl: './game-list-item.component.scss',
})
export class GameListItemComponent {
  game = input.required<UserGame>();
  listId = input.required<string>();
  faTrash = faTrash;
  gamesStore = inject(GamesStore);
  note = '';

  deleteGameFromList(gameId: number, listId: string): void {
    this.gamesStore.removeGameFromList(gameId, listId);
  }

  updateGameNote(gameId: number, note: string): void {
    this.gamesStore.updateGameNote(gameId, note);
  }
}
