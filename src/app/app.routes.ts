import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { GameListsComponent } from './components/game-lists/game-lists.component';
import { FeedComponent } from './components/feed/feed.component';
import { GameDetailsComponent } from './components/game-details/game-details.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'game-lists',
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
    path: 'feed',
    component: FeedComponent,
  },
  {
    path: 'game/:id',
    component: GameDetailsComponent,
  },
  {
    path: '*',
    redirectTo: 'game-lists',
  },
];
