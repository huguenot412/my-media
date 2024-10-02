import { Component, inject, Input, OnInit } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { Observable, of } from 'rxjs';
import { Game } from '../../model/games.interfaces';
import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  NgOptimizedImage,
} from '@angular/common';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, DatePipe, DecimalPipe],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.scss',
})
export class GameDetailsComponent implements OnInit {
  @Input() id = '';
  gamesService = inject(GamesService);
  game$: Observable<Game[]> = of([]);

  ngOnInit(): void {
    this.game$ = this.gamesService.getGameDetails(this.id);
  }
}
