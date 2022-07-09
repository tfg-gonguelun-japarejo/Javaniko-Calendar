import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { Status } from 'app/entities/enumerations/status.model';
import { ISprint, Sprint } from '../sprint.model';

import { SprintService } from './sprint.service';

describe('Service Tests', () => {
  describe('Sprint Service', () => {
    let service: SprintService;
    let httpMock: HttpTestingController;
    let elemDefault: ISprint;
    let expectedResult: ISprint | ISprint[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SprintService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        title: 'hola',
        createdAt: currentDate,
        dueOn: currentDate,
        status: Status.ON_GOING,
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            createdAt: currentDate.format(DATE_FORMAT),
            dueOn: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Sprint', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdAt: currentDate.format(DATE_FORMAT),
            dueOn: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
            dueOn: currentDate,
          },
          returnedFromService
        );

        service.create(new Sprint()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Sprint', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'hola2',
            createdAt: currentDate.format(DATE_FORMAT),
            dueOn: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
            dueOn: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Sprint', () => {
        const patchObject = Object.assign(
          {
            status: 'BBBBBB',
            description: 'BBBBBB',
          },
          new Sprint()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            createdAt: currentDate,
            dueOn: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Sprint', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'hola3',
            createdAt: currentDate.format(DATE_FORMAT),
            dueOn: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
            dueOn: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Sprint', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSprintToCollectionIfMissing', () => {
        it('should add a Sprint to an empty array', () => {
          const sprint: ISprint = { id: 123 };
          expectedResult = service.addSprintToCollectionIfMissing([], sprint);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sprint);
        });

        it('should not add a Sprint to an array that contains it', () => {
          const sprint: ISprint = { id: 123 };
          const sprintCollection: ISprint[] = [
            {
              ...sprint,
            },
            { id: 456 },
          ];
          expectedResult = service.addSprintToCollectionIfMissing(sprintCollection, sprint);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Sprint to an array that doesn't contain it", () => {
          const sprint: ISprint = { id: 123 };
          const sprintCollection: ISprint[] = [{ id: 456 }];
          expectedResult = service.addSprintToCollectionIfMissing(sprintCollection, sprint);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sprint);
        });

        it('should add only unique Sprint to an array', () => {
          const sprintArray: ISprint[] = [{ id: 123 }, { id: 456 }, { id: 36286 }];
          const sprintCollection: ISprint[] = [{ id: 123 }];
          expectedResult = service.addSprintToCollectionIfMissing(sprintCollection, ...sprintArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const sprint: ISprint = { id: 123 };
          const sprint2: ISprint = { id: 456 };
          expectedResult = service.addSprintToCollectionIfMissing([], sprint, sprint2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sprint);
          expect(expectedResult).toContain(sprint2);
        });

        it('should accept null and undefined values', () => {
          const sprint: ISprint = { id: 123 };
          expectedResult = service.addSprintToCollectionIfMissing([], null, sprint, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sprint);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
