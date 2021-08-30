jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { WorkspaceService } from '../service/workspace.service';
import { IWorkspace, Workspace } from '../workspace.model';

import { WorkspaceUpdateComponent } from './workspace-update.component';

describe('Component Tests', () => {
  describe('Workspace Management Update Component', () => {
    let comp: WorkspaceUpdateComponent;
    let fixture: ComponentFixture<WorkspaceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let workspaceService: WorkspaceService;

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

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const workspace: IWorkspace = { id: 456 };

        activatedRoute.data = of({ workspace });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(workspace));
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
  });
});
