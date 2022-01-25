import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWorkspace, Workspace } from '../workspace.model';

import { WorkspaceService } from './workspace.service';

describe('Service Tests', () => {
  describe('Workspace Service', () => {
    let service: WorkspaceService;
    let httpMock: HttpTestingController;
    let elemDefault: IWorkspace;
    let expectedResult: IWorkspace | IWorkspace[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(WorkspaceService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        login: 'AAAAAAA',
        repos_url: 'AAAAAAA',
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Workspace', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Workspace()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Workspace', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            login: 'BBBBBB',
            repos_url: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Workspace', () => {
        const patchObject = Object.assign(
          {
            login: 'BBBBBB',
            description: 'BBBBBB',
          },
          new Workspace()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Workspace', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            login: 'BBBBBB',
            repos_url: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Workspace', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addWorkspaceToCollectionIfMissing', () => {
        it('should add a Workspace to an empty array', () => {
          const workspace: IWorkspace = { id: 123 };
          expectedResult = service.addWorkspaceToCollectionIfMissing([], workspace);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(workspace);
        });

        it('should not add a Workspace to an array that contains it', () => {
          const workspace: IWorkspace = { id: 123 };
          const workspaceCollection: IWorkspace[] = [
            {
              ...workspace,
            },
            { id: 456 },
          ];
          expectedResult = service.addWorkspaceToCollectionIfMissing(workspaceCollection, workspace);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Workspace to an array that doesn't contain it", () => {
          const workspace: IWorkspace = { id: 123 };
          const workspaceCollection: IWorkspace[] = [{ id: 456 }];
          expectedResult = service.addWorkspaceToCollectionIfMissing(workspaceCollection, workspace);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(workspace);
        });

        it('should add only unique Workspace to an array', () => {
          const workspaceArray: IWorkspace[] = [{ id: 123 }, { id: 456 }, { id: 71134 }];
          const workspaceCollection: IWorkspace[] = [{ id: 123 }];
          expectedResult = service.addWorkspaceToCollectionIfMissing(workspaceCollection, ...workspaceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const workspace: IWorkspace = { id: 123 };
          const workspace2: IWorkspace = { id: 456 };
          expectedResult = service.addWorkspaceToCollectionIfMissing([], workspace, workspace2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(workspace);
          expect(expectedResult).toContain(workspace2);
        });

        it('should accept null and undefined values', () => {
          const workspace: IWorkspace = { id: 123 };
          expectedResult = service.addWorkspaceToCollectionIfMissing([], null, workspace, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(workspace);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
