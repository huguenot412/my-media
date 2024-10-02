import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { GameListsComponent } from './components/game-lists/game-lists.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchComponent, GameListsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-media';
}
