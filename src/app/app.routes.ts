import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { GameListsComponent } from './components/game-lists/game-lists.component';
import { FeedComponent } from './components/feed/feed.component';
import { GameDetailsComponent } from './components/game-details/game-details.component';
import { LoginComponent } from './components/login/login.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { BookListsComponent } from './components/books/book-lists/book-lists.component';
import { ShowListsComponent } from './components/shows/show-lists/show-lists.component';
import { MyListsComponent } from './components/my-lists/my-lists.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'my-lists/:userId',
    component: MyListsComponent,
  },
  {
    path: 'friends/:userId',
    component: FeedComponent,
  },
  {
    path: 'game/:id',
    component: GameDetailsComponent,
  },
  {
    path: '*',
    redirectTo: 'login',
  },
];
