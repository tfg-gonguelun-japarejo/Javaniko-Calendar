jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { WorkspaceService } from '../service/workspace.service';
import { IWorkspace, Workspace } from '../workspace.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { WorkspaceUpdateComponent } from './workspace-update.component';

describe('Component Tests', () => {
  describe('Workspace Management Update Component', () => {
    let comp: WorkspaceUpdateComponent;
    let fixture: ComponentFixture<WorkspaceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let workspaceService: WorkspaceService;
    let usuarioService: UsuarioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [WorkspaceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(WorkspaceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkspaceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      workspaceService = TestBed.inject(WorkspaceService);
      usuarioService = TestBed.inject(UsuarioService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Usuario query and add missing value', () => {
        const workspace: IWorkspace = { id: 456 };
        const usuarios: IUsuario[] = [{ id: 26386 }];
        workspace.usuarios = usuarios;

        const usuarioCollection: IUsuario[] = [{ id: 46376 }];
        spyOn(usuarioService, 'query').and.returnValue(of(new HttpResponse({ body: usuarioCollection })));
        const additionalUsuarios = [...usuarios];
        const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
        spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ workspace });
        comp.ngOnInit();

        expect(usuarioService.query).toHaveBeenCalled();
        expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(usuarioCollection, ...additionalUsuarios);
        expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const workspace: IWorkspace = { id: 456 };
        const usuarios: IUsuario = { id: 43586 };
        workspace.usuarios = [usuarios];

        activatedRoute.data = of({ workspace });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(workspace));
        expect(comp.usuariosSharedCollection).toContain(usuarios);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const workspace = { id: 123 };
        spyOn(workspaceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ workspace });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: workspace }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(workspaceService.update).toHaveBeenCalledWith(workspace);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const workspace = new Workspace();
        spyOn(workspaceService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ workspace });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: workspace }));
        saveSubject.complete();

        // THEN
        expect(workspaceService.create).toHaveBeenCalledWith(workspace);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const workspace = { id: 123 };
        spyOn(workspaceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ workspace });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(workspaceService.update).toHaveBeenCalledWith(workspace);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUsuarioById', () => {
        it('Should return tracked Usuario primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUsuarioById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedUsuario', () => {
        it('Should return option if no Usuario is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedUsuario(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Usuario for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedUsuario(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Usuario is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedUsuario(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
