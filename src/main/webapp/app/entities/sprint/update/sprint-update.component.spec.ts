jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SprintService } from '../service/sprint.service';
import { ISprint, Sprint } from '../sprint.model';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { ProyectService } from 'app/entities/proyect/service/proyect.service';

import { SprintUpdateComponent } from './sprint-update.component';

describe('Component Tests', () => {
  describe('Sprint Management Update Component', () => {
    let comp: SprintUpdateComponent;
    let fixture: ComponentFixture<SprintUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let sprintService: SprintService;
    let proyectService: ProyectService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SprintUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SprintUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SprintUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      sprintService = TestBed.inject(SprintService);
      proyectService = TestBed.inject(ProyectService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Proyect query and add missing value', () => {
        const sprint: ISprint = { id: 456 };
        const proyect: IProyect = { id: 99067 };
        sprint.proyect = proyect;

        const proyectCollection: IProyect[] = [{ id: 14068 }];
        spyOn(proyectService, 'query').and.returnValue(of(new HttpResponse({ body: proyectCollection })));
        const additionalProyects = [proyect];
        const expectedCollection: IProyect[] = [...additionalProyects, ...proyectCollection];
        spyOn(proyectService, 'addProyectToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ sprint });
        comp.ngOnInit();

        expect(proyectService.query).toHaveBeenCalled();
        expect(proyectService.addProyectToCollectionIfMissing).toHaveBeenCalledWith(proyectCollection, ...additionalProyects);
        expect(comp.proyectsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const sprint: ISprint = { id: 456 };
        const proyect: IProyect = { id: 6724 };
        sprint.proyect = proyect;

        activatedRoute.data = of({ sprint });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(sprint));
        expect(comp.proyectsSharedCollection).toContain(proyect);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sprint = { id: 123 };
        spyOn(sprintService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sprint });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sprint }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(sprintService.update).toHaveBeenCalledWith(sprint);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sprint = new Sprint();
        spyOn(sprintService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sprint });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sprint }));
        saveSubject.complete();

        // THEN
        expect(sprintService.create).toHaveBeenCalledWith(sprint);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sprint = { id: 123 };
        spyOn(sprintService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sprint });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(sprintService.update).toHaveBeenCalledWith(sprint);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProyectById', () => {
        it('Should return tracked Proyect primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProyectById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
