import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Game } from '../model/games.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  http = inject(HttpClient);
  baseUrl = '/api/v4/';
  clientId = 'drkuja414nzxbjkvpr71vjy4auc123';
  accessToken = 'feylfs8gjo8804ausdepjj6khdtsfh';
  headers = {
    'Client-ID': this.clientId,
    Authorization: `Bearer ${this.accessToken}`,
    'Content-Type': 'text/plain',
  };

  getGamesByName(name: string): Observable<Game[]> {
    return this.http.post<Game[]>(
      this.baseUrl + 'games',
      `fields name, cover.url, cover.width, cover.height; where parent_game = null; search "${name}"; limit 50;`,
      { headers: this.headers }
    );
  }

  getGameDetails(gameId: string): Observable<Game[]> {
    const body = `
      fields *, cover.url, first_release_date, game_modes.name, genres.name, involved_companies.company.name, involved_companies.developer, platforms.name, platforms.platform_logo.url;
      where id = ${gameId};
    `;

    return this.http.post<Game[]>(this.baseUrl + 'games', body, {
      headers: this.headers,
    });
  }
}
