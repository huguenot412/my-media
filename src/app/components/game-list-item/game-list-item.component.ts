import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { UserGame } from '../../model/games.interfaces';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GamesStore } from '../../store/games.store';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { GameListsStore } from '../../store/game-lists.store';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-game-list-item',
  standalone: true,
  imports: [
    RouterLink,
    RatingComponent,
    FontAwesomeModule,
    FormsModule,
    NgOptimizedImage,
    MatCardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-list-item.component.html',
  styleUrl: './game-list-item.component.scss',
})
export class GameListItemComponent implements OnInit {
  game = input.required<UserGame>();
  gamesStore = inject(GamesStore);
  gameListsStore = inject(GameListsStore);
  listId = input.required<string>();
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  note = '';
  detailView = input.required<boolean>();
  rankedView = input.required<boolean>();
  rank = input.required<number>();
  editNote = signal(false);

  ngOnInit(): void {
    this.note = this.game().note;
  }

  deleteGameFromList(): void {
    this.gameListsStore.removeGameFromList(this.listId(), this.game().id);
  }

  updateGameNote(): void {
    this.gamesStore.updateGameNote(this.game().id, this.note);
    this.toggleEditNote();
  }

  toggleEditNote(): void {
    this.editNote.set(!this.editNote());
  }
}
