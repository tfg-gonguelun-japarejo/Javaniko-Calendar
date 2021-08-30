import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InputDetailComponent } from './input-detail.component';

describe('Component Tests', () => {
  describe('Input Management Detail Component', () => {
    let comp: InputDetailComponent;
    let fixture: ComponentFixture<InputDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [InputDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ input: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(InputDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(InputDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load input on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.input).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
