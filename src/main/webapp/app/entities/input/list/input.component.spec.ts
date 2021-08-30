import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { InputService } from '../service/input.service';

import { InputComponent } from './input.component';

describe('Component Tests', () => {
  describe('Input Management Component', () => {
    let comp: InputComponent;
    let fixture: ComponentFixture<InputComponent>;
    let service: InputService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InputComponent],
      })
        .overrideTemplate(InputComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InputComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(InputService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.inputs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
