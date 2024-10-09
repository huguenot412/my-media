import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { GameListsComponent } from './components/game-lists/game-lists.component';
import { FeedComponent } from './components/feed/feed.component';
import { GameDetailsComponent } from './components/game-details/game-details.component';
import { LoginComponent } from './components/login/login.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { BookListsComponent } from './components/books/book-lists/book-lists.component';
import { ShowListsComponent } from './components/shows/show-lists/show-lists.component';

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
    path: 'game-lists',
    component: GameListsComponent,
  },
  {
    path: 'book-lists',
    component: BookListsComponent,
  },
  {
    path: 'show-lists',
    component: ShowListsComponent,
  },
  {
    path: 'feed',
    component: FeedComponent,
  },
  {
    path: 'game/:id',
    component: GameDetailsComponent,
  },
  {
    path: 'recommendations',
    component: RecommendationsComponent,
  },
  {
    path: '*',
    redirectTo: 'game-lists',
  },
];
