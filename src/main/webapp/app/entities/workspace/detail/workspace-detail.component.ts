import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { map } from 'rxjs/operators';

import { IWorkspace } from '../workspace.model';

@Component({
  selector: 'jhi-workspace-detail',
  templateUrl: './workspace-detail.component.html',
})
export class WorkspaceDetailComponent implements OnInit {
  workspace: IWorkspace | null = null;

  usuariosSharedCollection: IUsuario[] = [];

  constructor(protected activatedRoute: ActivatedRoute, protected usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workspace }) => {
      this.workspace = workspace;
    });

    this.loadRelationshipsOptions();
  }

  previousState(): void {
    window.history.back();
  }

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  hideUsuario(usuario: IUsuario, workspace: IWorkspace): boolean {
    let result = false;
    usuario.workspaces?.forEach(w => {
      if (w.login === workspace.login) {
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
