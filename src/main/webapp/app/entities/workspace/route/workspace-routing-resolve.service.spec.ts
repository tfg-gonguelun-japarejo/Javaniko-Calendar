jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IWorkspace, Workspace } from '../workspace.model';
import { WorkspaceService } from '../service/workspace.service';

import { WorkspaceRoutingResolveService } from './workspace-routing-resolve.service';

describe('Service Tests', () => {
  describe('Workspace routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: WorkspaceRoutingResolveService;
    let service: WorkspaceService;
    let resultWorkspace: IWorkspace | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(WorkspaceRoutingResolveService);
      service = TestBed.inject(WorkspaceService);
      resultWorkspace = undefined;
    });

    describe('resolve', () => {
      it('should return IWorkspace returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWorkspace = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultWorkspace).toEqual({ id: 123 });
      });

      it('should return new IWorkspace if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWorkspace = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultWorkspace).toEqual(new Workspace());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWorkspace = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultWorkspace).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
