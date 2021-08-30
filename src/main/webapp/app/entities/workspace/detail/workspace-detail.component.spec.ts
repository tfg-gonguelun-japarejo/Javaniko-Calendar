import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WorkspaceDetailComponent } from './workspace-detail.component';

describe('Component Tests', () => {
  describe('Workspace Management Detail Component', () => {
    let comp: WorkspaceDetailComponent;
    let fixture: ComponentFixture<WorkspaceDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [WorkspaceDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ workspace: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(WorkspaceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WorkspaceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load workspace on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.workspace).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
