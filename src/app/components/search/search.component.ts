import { Component, OnInit, inject } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  gamesService = inject(GamesService);

  searchResults$ = of([]);

  ngOnInit(): void {
    this.searchResults$ = this.gamesService.getGamesByName('"The Witcher"');
  }
}
