import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IInput, Input } from '../input.model';

import { InputService } from './input.service';

describe('Service Tests', () => {
  describe('Input Service', () => {
    let service: InputService;
    let httpMock: HttpTestingController;
    let elemDefault: IInput;
    let expectedResult: IInput | IInput[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(InputService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        comment: 'AAAAAAA',
        feelings: 0,
        inputDate: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            inputDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Input', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            inputDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            inputDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Input()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Input', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            comment: 'BBBBBB',
            feelings: 1,
            inputDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            inputDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Input', () => {
        const patchObject = Object.assign(
          {
            feelings: 1,
            inputDate: currentDate.format(DATE_FORMAT),
          },
          new Input()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            inputDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Input', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            comment: 'BBBBBB',
            feelings: 1,
            inputDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            inputDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Input', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addInputToCollectionIfMissing', () => {
        it('should add a Input to an empty array', () => {
          const input: IInput = { id: 123 };
          expectedResult = service.addInputToCollectionIfMissing([], input);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(input);
        });

        it('should not add a Input to an array that contains it', () => {
          const input: IInput = { id: 123 };
          const inputCollection: IInput[] = [
            {
              ...input,
            },
            { id: 456 },
          ];
          expectedResult = service.addInputToCollectionIfMissing(inputCollection, input);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Input to an array that doesn't contain it", () => {
          const input: IInput = { id: 123 };
          const inputCollection: IInput[] = [{ id: 456 }];
          expectedResult = service.addInputToCollectionIfMissing(inputCollection, input);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(input);
        });

        it('should add only unique Input to an array', () => {
          const inputArray: IInput[] = [{ id: 123 }, { id: 456 }, { id: 2264 }];
          const inputCollection: IInput[] = [{ id: 123 }];
          expectedResult = service.addInputToCollectionIfMissing(inputCollection, ...inputArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const input: IInput = { id: 123 };
          const input2: IInput = { id: 456 };
          expectedResult = service.addInputToCollectionIfMissing([], input, input2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(input);
          expect(expectedResult).toContain(input2);
        });

        it('should accept null and undefined values', () => {
          const input: IInput = { id: 123 };
          expectedResult = service.addInputToCollectionIfMissing([], null, input, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(input);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
