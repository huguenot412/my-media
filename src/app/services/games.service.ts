import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  http = inject(HttpClient);
  baseUrl = 'https://api.igdb.com/v4/search/';
  clientId = 'drkuja414nzxbjkvpr71vjy4auc123';
  accessToken = 'feylfs8gjo8804ausdepjj6khdtsfh';
  headers = {
    'Client-ID': this.clientId,
    Authorization: `Bearer ${this.accessToken}`,
    'Content-Type': 'text/plain',
  };

  getGamesByName(name: string): any {
    return this.http.post(
      this.baseUrl,
      `fields name; search ${name}; limit 50;`,
      { headers: this.headers }
    );

    // return fetch(this.baseUrl, {
    //   method: 'POST',
    //   body: `fields name; search ${name}; limit 50;`,
    //   headers: this.headers,
    // });
  }
}
