import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProyect } from '../proyect.model';

@Component({
  selector: 'jhi-proyect-detail',
  templateUrl: './proyect-detail.component.html',
})
export class ProyectDetailComponent implements OnInit {
  proyect: IProyect | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ proyect }) => {
      this.proyect = proyect;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
