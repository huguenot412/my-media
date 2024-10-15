import { Component, input } from '@angular/core';
import { GameListComponent } from '../game-list/game-list.component';
import { BookListsComponent } from '../books/book-lists/book-lists.component';
import { ShowListsComponent } from '../shows/show-lists/show-lists.component';
import { MatTabsModule } from '@angular/material/tabs';
import { GameListsComponent } from '../game-lists/game-lists.component';

@Component({
  selector: 'app-my-lists',
  standalone: true,
  imports: [
    GameListComponent,
    BookListsComponent,
    ShowListsComponent,
    MatTabsModule,
    GameListsComponent,
  ],
  templateUrl: './my-lists.component.html',
  styleUrl: './my-lists.component.scss',
})
export class MyListsComponent {
  userId = input('');
}
