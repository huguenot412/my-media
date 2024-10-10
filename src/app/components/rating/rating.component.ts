import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { Rating } from '../../model/games.interfaces';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { NgClass } from '@angular/common';
import { GamesStore } from '../../store/games.store';
import { User } from '../../model/users.interfaces';
import { GameListsStore } from '../../store/game-lists.store';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [FontAwesomeModule, NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent implements OnInit {
  gameListsStore = inject(GameListsStore);
  userService = inject(UserService);
  rating = input.required<Rating>();
  gameId = input.required<number>();
  gamesStore = inject(GamesStore);
  stars = signal<boolean[]>([]);
  faStar = faStar;

  ngOnInit(): void {
    for (let i = 0; i < this.rating().total; i++) {
      this.stars().push(true);
    }
  }

  updateGameRating(id: number, score: number): void {
    this.gamesStore.updateGameRating(id, score);

    const update: Partial<User> = {
      games: this.gamesStore.entities(),
    };

    this.userService.updateUser(update);
  }
}
