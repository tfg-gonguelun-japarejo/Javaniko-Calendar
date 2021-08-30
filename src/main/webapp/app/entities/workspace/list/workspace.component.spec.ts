import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { WorkspaceService } from '../service/workspace.service';

import { WorkspaceComponent } from './workspace.component';

describe('Component Tests', () => {
  describe('Workspace Management Component', () => {
    let comp: WorkspaceComponent;
    let fixture: ComponentFixture<WorkspaceComponent>;
    let service: WorkspaceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [WorkspaceComponent],
      })
        .overrideTemplate(WorkspaceComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkspaceComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(WorkspaceService);

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
      expect(comp.workspaces?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
