jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IInput, Input } from '../input.model';
import { InputService } from '../service/input.service';

import { InputRoutingResolveService } from './input-routing-resolve.service';

describe('Service Tests', () => {
  describe('Input routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: InputRoutingResolveService;
    let service: InputService;
    let resultInput: IInput | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(InputRoutingResolveService);
      service = TestBed.inject(InputService);
      resultInput = undefined;
    });

    describe('resolve', () => {
      it('should return IInput returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInput = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultInput).toEqual({ id: 123 });
      });

      it('should return new IInput if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInput = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultInput).toEqual(new Input());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInput = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultInput).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
