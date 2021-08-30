jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UsuarioService } from '../service/usuario.service';
import { IUsuario, Usuario } from '../usuario.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { WorkspaceService } from 'app/entities/workspace/service/workspace.service';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { ProyectService } from 'app/entities/proyect/service/proyect.service';

import { UsuarioUpdateComponent } from './usuario-update.component';

describe('Component Tests', () => {
  describe('Usuario Management Update Component', () => {
    let comp: UsuarioUpdateComponent;
    let fixture: ComponentFixture<UsuarioUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let usuarioService: UsuarioService;
    let userService: UserService;
    let workspaceService: WorkspaceService;
    let proyectService: ProyectService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UsuarioUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UsuarioUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UsuarioUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      usuarioService = TestBed.inject(UsuarioService);
      userService = TestBed.inject(UserService);
      workspaceService = TestBed.inject(WorkspaceService);
      proyectService = TestBed.inject(ProyectService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const usuario: IUsuario = { id: 456 };
        const user: IUser = { id: 27699 };
        usuario.user = user;

        const userCollection: IUser[] = [{ id: 87926 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ usuario });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Workspace query and add missing value', () => {
        const usuario: IUsuario = { id: 456 };
        const workspaces: IWorkspace[] = [{ id: 18113 }];
        usuario.workspaces = workspaces;

        const workspaceCollection: IWorkspace[] = [{ id: 49628 }];
        spyOn(workspaceService, 'query').and.returnValue(of(new HttpResponse({ body: workspaceCollection })));
        const additionalWorkspaces = [...workspaces];
        const expectedCollection: IWorkspace[] = [...additionalWorkspaces, ...workspaceCollection];
        spyOn(workspaceService, 'addWorkspaceToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ usuario });
        comp.ngOnInit();

        expect(workspaceService.query).toHaveBeenCalled();
        expect(workspaceService.addWorkspaceToCollectionIfMissing).toHaveBeenCalledWith(workspaceCollection, ...additionalWorkspaces);
        expect(comp.workspacesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Proyect query and add missing value', () => {
        const usuario: IUsuario = { id: 456 };
        const proyects: IProyect[] = [{ id: 21706 }];
        usuario.proyects = proyects;

        const proyectCollection: IProyect[] = [{ id: 65991 }];
        spyOn(proyectService, 'query').and.returnValue(of(new HttpResponse({ body: proyectCollection })));
        const additionalProyects = [...proyects];
        const expectedCollection: IProyect[] = [...additionalProyects, ...proyectCollection];
        spyOn(proyectService, 'addProyectToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ usuario });
        comp.ngOnInit();

        expect(proyectService.query).toHaveBeenCalled();
        expect(proyectService.addProyectToCollectionIfMissing).toHaveBeenCalledWith(proyectCollection, ...additionalProyects);
        expect(comp.proyectsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const usuario: IUsuario = { id: 456 };
        const user: IUser = { id: 47918 };
        usuario.user = user;
        const workspaces: IWorkspace = { id: 51760 };
        usuario.workspaces = [workspaces];
        const proyects: IProyect = { id: 87405 };
        usuario.proyects = [proyects];

        activatedRoute.data = of({ usuario });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(usuario));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.workspacesSharedCollection).toContain(workspaces);
        expect(comp.proyectsSharedCollection).toContain(proyects);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usuario = { id: 123 };
        spyOn(usuarioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usuario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: usuario }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(usuarioService.update).toHaveBeenCalledWith(usuario);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usuario = new Usuario();
        spyOn(usuarioService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usuario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: usuario }));
        saveSubject.complete();

        // THEN
        expect(usuarioService.create).toHaveBeenCalledWith(usuario);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usuario = { id: 123 };
        spyOn(usuarioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usuario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(usuarioService.update).toHaveBeenCalledWith(usuario);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackWorkspaceById', () => {
        it('Should return tracked Workspace primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackWorkspaceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackProyectById', () => {
        it('Should return tracked Proyect primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProyectById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedWorkspace', () => {
        it('Should return option if no Workspace is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedWorkspace(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Workspace for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedWorkspace(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Workspace is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedWorkspace(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });

      describe('getSelectedProyect', () => {
        it('Should return option if no Proyect is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedProyect(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Proyect for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedProyect(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Proyect is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedProyect(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
