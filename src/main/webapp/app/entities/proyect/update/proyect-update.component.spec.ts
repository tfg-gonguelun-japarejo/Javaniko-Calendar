jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProyectService } from '../service/proyect.service';
import { IProyect, Proyect } from '../proyect.model';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { WorkspaceService } from 'app/entities/workspace/service/workspace.service';

import { ProyectUpdateComponent } from './proyect-update.component';

describe('Component Tests', () => {
  describe('Proyect Management Update Component', () => {
    let comp: ProyectUpdateComponent;
    let fixture: ComponentFixture<ProyectUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let proyectService: ProyectService;
    let workspaceService: WorkspaceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProyectUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProyectUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProyectUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      proyectService = TestBed.inject(ProyectService);
      workspaceService = TestBed.inject(WorkspaceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Workspace query and add missing value', () => {
        const proyect: IProyect = { id: 456 };
        const workspace: IWorkspace = { id: 59487 };
        proyect.workspace = workspace;

        const workspaceCollection: IWorkspace[] = [{ id: 85414 }];
        spyOn(workspaceService, 'query').and.returnValue(of(new HttpResponse({ body: workspaceCollection })));
        const additionalWorkspaces = [workspace];
        const expectedCollection: IWorkspace[] = [...additionalWorkspaces, ...workspaceCollection];
        spyOn(workspaceService, 'addWorkspaceToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ proyect });
        comp.ngOnInit();

        expect(workspaceService.query).toHaveBeenCalled();
        expect(workspaceService.addWorkspaceToCollectionIfMissing).toHaveBeenCalledWith(workspaceCollection, ...additionalWorkspaces);
        expect(comp.workspacesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const proyect: IProyect = { id: 456 };
        const workspace: IWorkspace = { id: 11222 };
        proyect.workspace = workspace;

        activatedRoute.data = of({ proyect });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(proyect));
        expect(comp.workspacesSharedCollection).toContain(workspace);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const proyect = { id: 123 };
        spyOn(proyectService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ proyect });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: proyect }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(proyectService.update).toHaveBeenCalledWith(proyect);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const proyect = new Proyect();
        spyOn(proyectService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ proyect });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: proyect }));
        saveSubject.complete();

        // THEN
        expect(proyectService.create).toHaveBeenCalledWith(proyect);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const proyect = { id: 123 };
        spyOn(proyectService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ proyect });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(proyectService.update).toHaveBeenCalledWith(proyect);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackWorkspaceById', () => {
        it('Should return tracked Workspace primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackWorkspaceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
