import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { BoardsService } from '@services/boards.service';
import { Colors } from '@models/colors.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html',
})
export class BoardFormComponent implements OnInit {
  @Output() closeOverlay = new EventEmitter<boolean>();

  form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    backgroundColor: new FormControl<Colors>('sky', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  faCheck = faCheck;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private boardsService: BoardsService
  ) {}

  ngOnInit(): void {}

  doSave() {
    if (this.form.valid) {
      const { title, backgroundColor } = this.form.getRawValue();
      this.boardsService
        .createBoard(title, backgroundColor)
        .subscribe((board) => {
          console.log('board', board);
          this.closeOverlay.next(false);
          this.router.navigate(['/app/boards', board.id]);
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
