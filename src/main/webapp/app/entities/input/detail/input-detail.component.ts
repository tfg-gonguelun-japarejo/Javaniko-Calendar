import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInput } from '../input.model';

@Component({
  selector: 'jhi-input-detail',
  templateUrl: './input-detail.component.html',
})
export class InputDetailComponent implements OnInit {
  input: IInput | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ input }) => {
      this.input = input;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
