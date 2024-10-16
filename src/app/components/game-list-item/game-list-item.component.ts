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
import {
  faCircleInfo,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { GamesStore } from '../../store/games.store';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { GameListsStore } from '../../store/game-lists.store';
import { MatCardModule } from '@angular/material/card';
import { UserStore } from '../../store/user.store';
import { User } from '../../model/users.interfaces';
import { UserService } from '../../services/users.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { ListSelectComponent } from '../list-select/list-select.component';
import { GamesService } from '../../services/games.service';
import { ListGroupSelectComponent } from '../list-group-select/list-group-select.component';

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
    DragDropModule,
    MatButtonModule,
    MatInputModule,
    MatFormField,
    ListSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-list-item.component.html',
  styleUrl: './game-list-item.component.scss',
})
export class GameListItemComponent implements OnInit {
  editable = input(true);
  game = input.required<UserGame>();
  gamesService = inject(GamesService);
  listId = input.required<string>();
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  faCircleInfo = faCircleInfo;
  note = '';
  detailView = input.required<boolean>();
  rankedView = input.required<boolean>();
  rank = input.required<number>();
  editNote = signal(false);

  ngOnInit(): void {
    this.note = this.game().note;
  }

  deleteGameFromList(): void {
    if (!this.editable()) return;

    this.gamesService.deleteGameFromList(this.game().id, this.listId());
  }

  updateGameNote(): void {
    if (!this.editable()) return;

    this.gamesService.updateGameNote(this.game().id, this.note);
    this.toggleEditNote();
  }

  toggleEditNote(): void {
    if (!this.editable()) return;

    this.editNote.set(!this.editNote());
  }
}
