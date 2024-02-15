import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';
import { BoardsService } from './../../../../services/boards.service';

// import { ToDo, Column } from '@models/todo.model';
import { Board } from '@models/Board';
import { Card } from '@models/card.model';
import { CardsService } from '@services/cards.service';
import { List } from '@models/list.model';
import { ListsService } from '@services/list.service';
import { BACKGROUND_COLORS } from '@models/colors.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit, OnDestroy {
  board: Board | null = null;
  inputCard = new FormControl<string>('', {
    nonNullable: true,
    validators: [],
  });
  showListForm = false;
  inputList = new FormControl<string>('', {
    nonNullable: true,
    validators: [],
  });
  // formCard = this.formBuilder.nonNullable.group({

  // });
  colorBackgrounds = BACKGROUND_COLORS;

  constructor(
    private dialog: Dialog,
    private activatedRoute: ActivatedRoute,
    private boardsService: BoardsService,
    private cardsService: CardsService,
    private formBuilder: FormBuilder,
    private listsService: ListsService
  ) {}


  ngOnDestroy(): void {
    this.boardsService.setBackgroudColor('sky');
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const boardId = params.get('boardId');
      // console.log(boardId);

      if (boardId) {
        this.getBoard(boardId);
      }
    });
  }

  private getBoard(id: string) {
    this.boardsService.getBoardById(id).subscribe((board) => {
      console.log(board);
      this.board = board;
      this.boardsService.setBackgroudColor(board.backgroundColor);
    });
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // after
    const position = this.boardsService.getPosition(
      event.container.data,
      event.currentIndex
    );
    const card = event.container.data[event.currentIndex];

    console.log(position);
    console.log(card);
    const listId = event.container.id;

    this.updateCard(card, position, listId);
  }

  private updateCard(card: Card, position: number, listId: string) {
    this.cardsService
      .update(card.id, { position, listId })
      .subscribe((cardUpdated) => {
        console.log(cardUpdated);
      });
  }

  addList() {
    const title = this.inputList.getRawValue();
    if (this.board) {
      this.listsService
        .create({
          title,
          boardId: this.board.id,
          position: this.boardsService.getPositonNewItem(this.board.lists),
        })
        .subscribe((list) => {
          this.board?.lists.push({ ...list, cards: [] });
          this.showListForm = false;
          this.inputList.reset();
        });
    }
  }

  openDialog(card: Card) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      if (output) {
        console.log(output);
      }
    });
  }

  openFormCard(list: List) {
    // list.showCardForm = !list.showCardForm
    // 1.- List: false => todos
    // 2.- List: click => true
    if (this.board?.lists) {
      this.board.lists = this.board.lists.map((l) => ({
        ...l,
        showCardForm: l.id === list.id,
      }));
    }
  }

  createCard(list: List) {
    const title = this.inputCard.getRawValue();

    if (this.board) {
      this.cardsService
        .createCard({
          title,
          listId: list.id,
          boardId: this.board.id,
          position: this.boardsService.getPositonNewItem(list.cards),
        })
        .subscribe((card) => {
          console.log(card);
          list.cards.push(card);
          this.inputCard.reset();
          list.showCardForm = false;
        });
    }
  }

  closeCardForm(list: List) {
    list.showCardForm = false;
  }

  get colors() {
    if (this.board) {
      const clases = this.colorBackgrounds[this.board.backgroundColor];

      return clases || {};
    }

    return {};
  }
}
