import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Card, CardDto, CreateCardDto } from '@models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  createCard(card: CreateCardDto) {
    return this.http.post<Card>(`${this.apiUrl}/api/v1/cards`, card, {
      context: checkToken(),
    });
  }

  update(id: Card['id'], changes: CardDto) {
    return this.http.put(`${this.apiUrl}/api/v1/cards/${id}`, changes, {
      context: checkToken(),
    });
  }
}
