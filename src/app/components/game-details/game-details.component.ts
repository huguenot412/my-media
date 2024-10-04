import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { Observable, of } from 'rxjs';
import { Game, UserGame } from '../../model/games.interfaces';
import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  NgOptimizedImage,
} from '@angular/common';
import { GamesStore } from '../../store/games.store';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    DatePipe,
    DecimalPipe,
    RatingComponent,
  ],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.scss',
})
export class GameDetailsComponent implements OnInit {
  @Input() id = '';
  gamesService = inject(GamesService);
  game$: Observable<Game[]> = of([]);
  gamesStore = inject(GamesStore);
  userGame = signal<UserGame | null>(null);

  ngOnInit(): void {
    this.game$ = this.gamesService.getGameDetails(this.id);
    this.userGame.set(this.gamesStore.entityMap()[this.id] || null);
  }
}
