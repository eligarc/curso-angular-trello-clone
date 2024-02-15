import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Board } from '@models/Board';
import { Card } from '@models/card.model';
import { Colors } from '@models/colors.model';
import { List } from '@models/list.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  apiUrl = environment.API_URL;
  bufferSpace = 65535;
  backgroundColor$ = new BehaviorSubject<Colors>('sky');

  constructor(private http: HttpClient) {}

  getBoardById(id: Board['id']) {
    return this.http.get<Board>(`${this.apiUrl}/api/v1/boards/${id}`, {
      context: checkToken(),
    })
    // .pipe(
    //   tap((board) => {
    //     this.setBackgroudColor(board.backgroundColor);
    //   })
    // );
  }

  createBoard(title: string, backgroundColor: Colors) {
    return this.http.post<Board>(
      `${this.apiUrl}/api/v1/boards`,
      { title, backgroundColor },
      {
        context: checkToken(),
      }
    );
  }

  getPosition(cards: Card[], currentIndex: number) {
    if (cards.length === 1) {
      // return 'is new';
      return this.bufferSpace;
    }

    if (cards.length > 1 && currentIndex === 0) {
      const onTopPosition = cards[currentIndex + 1].position / 2;
      // return 'is the top';
      return onTopPosition;
    }

    const lastIndex = cards.length - 1;

    if (cards.length > 2 && currentIndex > 0 && currentIndex < lastIndex) {
      // return 'is the middle';
      const prevPosition = cards[currentIndex - 1].position;
      const nextPosition = cards[currentIndex + 1].position;

      return (prevPosition + nextPosition) / 2;
    }

    if (cards.length > 1 && currentIndex === lastIndex) {
      // return 'is the bottom';
      const onBottomPosition = cards[currentIndex - 1].position;

      return onBottomPosition + this.bufferSpace;
    }

    return 0;
  }

  getPositonNewItem(elements: Card[] | List[]) {
    if (elements.length === 0) {
      return this.bufferSpace;
    }

    const lastIndex = elements.length - 1;
    const onBottomPosition = elements[lastIndex].position;

    return onBottomPosition + this.bufferSpace;
  }

  setBackgroudColor(color: Colors) {
    this.backgroundColor$.next(color);
  }
}
