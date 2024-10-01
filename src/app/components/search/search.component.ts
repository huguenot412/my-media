import { Component, OnInit, inject, signal } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { Game } from '../../model/games.interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, FormsModule, NgOptimizedImage],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  gamesService = inject(GamesService);
  gameName = '';
  searchResults$: Observable<Game[]> = of([]);

  searchGamesByName(): void {
    this.searchResults$ = this.gamesService.getGamesByName(this.gameName);
  }
}
