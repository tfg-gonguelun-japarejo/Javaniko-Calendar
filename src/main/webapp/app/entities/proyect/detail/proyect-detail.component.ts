import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { map } from 'rxjs/operators';

import { IProyect } from '../proyect.model';

@Component({
  selector: 'jhi-proyect-detail',
  templateUrl: './proyect-detail.component.html',
})
export class ProyectDetailComponent implements OnInit {
  proyect: IProyect | null = null;

  usuariosSharedCollection: IUsuario[] = [];

  constructor(protected activatedRoute: ActivatedRoute, protected usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ proyect }) => {
      this.proyect = proyect;
    });

    this.loadRelationshipsOptions();
  }

  previousState(): void {
    window.history.back();
  }

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  hideUsuario(usuario: IUsuario, proyect: IProyect): boolean {
    let result = false;
    usuario.proyects?.forEach(p => {
      if (p.name === proyect.name) {
        result = true;
        return result;
      }
    });
    return result;
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing(usuarios)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
