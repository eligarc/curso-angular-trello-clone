import { Component, Input, OnInit } from '@angular/core';
import { COLORS, Colors } from '@models/colors.model';

@Component({
  selector: 'app-card-color',
  templateUrl: './card-color.component.html',
})
export class CardColorComponent implements OnInit {
  // @Input() color: keyof typeof this.mapColorToClass = 'sky';
  @Input() color: Colors = 'sky';

  constructor() {}

  ngOnInit(): void {}

  mapColorToClass = COLORS;

  get colors() {
    return this.mapColorToClass[this.color] || {};
  }
}
