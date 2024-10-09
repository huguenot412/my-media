import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { GameListsStore } from './store/game-lists.store';
import { GameList } from './model/games.interfaces';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NavComponent } from './components/nav/nav.component';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    NavComponent,
    JsonPipe,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  router = inject(Router);
  gameListsStore = inject(GameListsStore);
  title = 'my-media';
  firestore = inject(Firestore);

  users$!: Observable<any[]>;

  constructor() {
    const aCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(aCollection);
  }

  ngOnInit(): void {
    // this.gameListsStore.addGameLists(this.defaultGameLists);
    // if (!localStorage.getItem('activeUser')) {
    //   this.router.navigate(['/login']);
    // }
  }
}
