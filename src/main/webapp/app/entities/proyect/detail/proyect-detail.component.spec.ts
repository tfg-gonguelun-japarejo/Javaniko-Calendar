import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProyectDetailComponent } from './proyect-detail.component';

describe('Component Tests', () => {
  describe('Proyect Management Detail Component', () => {
    let comp: ProyectDetailComponent;
    let fixture: ComponentFixture<ProyectDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProyectDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ proyect: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProyectDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProyectDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load proyect on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.proyect).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
