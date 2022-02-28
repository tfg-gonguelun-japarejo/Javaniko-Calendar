import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IProyect, Proyect } from '../proyect.model';

import { ProyectService } from './proyect.service';

describe('Service Tests', () => {
  describe('Proyect Service', () => {
    let service: ProyectService;
    let httpMock: HttpTestingController;
    let elemDefault: IProyect;
    let expectedResult: IProyect | IProyect[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProyectService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        description: 'AAAAAAA',
        createdAt: currentDate,
        isPrivate: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            createdAt: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Proyect', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdAt: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
          },
          returnedFromService
        );

        service.create(new Proyect()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Proyect', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            description: 'BBBBBB',
            createdAt: currentDate.format(DATE_FORMAT),
            isPrivate: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Proyect', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            createdAt: currentDate.format(DATE_FORMAT),
          },
          new Proyect()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            createdAt: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Proyect', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            description: 'BBBBBB',
            createdAt: currentDate.format(DATE_FORMAT),
            isPrivate: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Proyect', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProyectToCollectionIfMissing', () => {
        it('should add a Proyect to an empty array', () => {
          const proyect: IProyect = { id: 123 };
          expectedResult = service.addProyectToCollectionIfMissing([], proyect);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(proyect);
        });

        it('should not add a Proyect to an array that contains it', () => {
          const proyect: IProyect = { id: 123 };
          const proyectCollection: IProyect[] = [
            {
              ...proyect,
            },
            { id: 456 },
          ];
          expectedResult = service.addProyectToCollectionIfMissing(proyectCollection, proyect);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Proyect to an array that doesn't contain it", () => {
          const proyect: IProyect = { id: 123 };
          const proyectCollection: IProyect[] = [{ id: 456 }];
          expectedResult = service.addProyectToCollectionIfMissing(proyectCollection, proyect);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(proyect);
        });

        it('should add only unique Proyect to an array', () => {
          const proyectArray: IProyect[] = [{ id: 123 }, { id: 456 }, { id: 19703 }];
          const proyectCollection: IProyect[] = [{ id: 123 }];
          expectedResult = service.addProyectToCollectionIfMissing(proyectCollection, ...proyectArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const proyect: IProyect = { id: 123 };
          const proyect2: IProyect = { id: 456 };
          expectedResult = service.addProyectToCollectionIfMissing([], proyect, proyect2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(proyect);
          expect(expectedResult).toContain(proyect2);
        });

        it('should accept null and undefined values', () => {
          const proyect: IProyect = { id: 123 };
          expectedResult = service.addProyectToCollectionIfMissing([], null, proyect, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(proyect);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
