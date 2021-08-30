import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SprintService } from '../service/sprint.service';

import { SprintComponent } from './sprint.component';

describe('Component Tests', () => {
  describe('Sprint Management Component', () => {
    let comp: SprintComponent;
    let fixture: ComponentFixture<SprintComponent>;
    let service: SprintService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SprintComponent],
      })
        .overrideTemplate(SprintComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SprintComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SprintService);

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
      expect(comp.sprints?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
