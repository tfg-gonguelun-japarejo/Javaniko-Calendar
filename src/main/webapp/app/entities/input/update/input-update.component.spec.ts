jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { InputService } from '../service/input.service';
import { IInput, Input } from '../input.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { ICalendar } from 'app/entities/calendar/calendar.model';
import { CalendarService } from 'app/entities/calendar/service/calendar.service';

import { InputUpdateComponent } from './input-update.component';

describe('Component Tests', () => {
  describe('Input Management Update Component', () => {
    let comp: InputUpdateComponent;
    let fixture: ComponentFixture<InputUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let inputService: InputService;
    let usuarioService: UsuarioService;
    let calendarService: CalendarService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InputUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(InputUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InputUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      inputService = TestBed.inject(InputService);
      usuarioService = TestBed.inject(UsuarioService);
      calendarService = TestBed.inject(CalendarService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Usuario query and add missing value', () => {
        const input: IInput = { id: 456 };
        const usuario: IUsuario = { id: 16609 };
        input.usuario = usuario;

        const usuarioCollection: IUsuario[] = [{ id: 63584 }];
        spyOn(usuarioService, 'query').and.returnValue(of(new HttpResponse({ body: usuarioCollection })));
        const additionalUsuarios = [usuario];
        const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
        spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ input });
        comp.ngOnInit();

        expect(usuarioService.query).toHaveBeenCalled();
        expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(usuarioCollection, ...additionalUsuarios);
        expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Calendar query and add missing value', () => {
        const input: IInput = { id: 456 };
        const calendar: ICalendar = { id: 11171 };
        input.calendar = calendar;

        const calendarCollection: ICalendar[] = [{ id: 36144 }];
        spyOn(calendarService, 'query').and.returnValue(of(new HttpResponse({ body: calendarCollection })));
        const additionalCalendars = [calendar];
        const expectedCollection: ICalendar[] = [...additionalCalendars, ...calendarCollection];
        spyOn(calendarService, 'addCalendarToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ input });
        comp.ngOnInit();

        expect(calendarService.query).toHaveBeenCalled();
        expect(calendarService.addCalendarToCollectionIfMissing).toHaveBeenCalledWith(calendarCollection, ...additionalCalendars);
        expect(comp.calendarsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const input: IInput = { id: 456 };
        const usuario: IUsuario = { id: 41606 };
        input.usuario = usuario;
        const calendar: ICalendar = { id: 52682 };
        input.calendar = calendar;

        activatedRoute.data = of({ input });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(input));
        expect(comp.usuariosSharedCollection).toContain(usuario);
        expect(comp.calendarsSharedCollection).toContain(calendar);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const input = { id: 123 };
        spyOn(inputService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ input });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: input }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(inputService.update).toHaveBeenCalledWith(input);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const input = new Input();
        spyOn(inputService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ input });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: input }));
        saveSubject.complete();

        // THEN
        expect(inputService.create).toHaveBeenCalledWith(input);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const input = { id: 123 };
        spyOn(inputService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ input });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(inputService.update).toHaveBeenCalledWith(input);
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

      describe('trackCalendarById', () => {
        it('Should return tracked Calendar primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCalendarById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
