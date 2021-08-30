jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProyect, Proyect } from '../proyect.model';
import { ProyectService } from '../service/proyect.service';

import { ProyectRoutingResolveService } from './proyect-routing-resolve.service';

describe('Service Tests', () => {
  describe('Proyect routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProyectRoutingResolveService;
    let service: ProyectService;
    let resultProyect: IProyect | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProyectRoutingResolveService);
      service = TestBed.inject(ProyectService);
      resultProyect = undefined;
    });

    describe('resolve', () => {
      it('should return IProyect returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProyect = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProyect).toEqual({ id: 123 });
      });

      it('should return new IProyect if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProyect = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProyect).toEqual(new Proyect());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProyect = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProyect).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
