import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProyectService } from '../service/proyect.service';

import { ProyectComponent } from './proyect.component';

describe('Component Tests', () => {
  describe('Proyect Management Component', () => {
    let comp: ProyectComponent;
    let fixture: ComponentFixture<ProyectComponent>;
    let service: ProyectService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProyectComponent],
      })
        .overrideTemplate(ProyectComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProyectComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProyectService);

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
      expect(comp.proyects?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
