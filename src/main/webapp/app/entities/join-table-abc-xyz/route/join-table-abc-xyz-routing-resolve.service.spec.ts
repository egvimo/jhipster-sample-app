jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJoinTableAbcXyz, JoinTableAbcXyz } from '../join-table-abc-xyz.model';
import { JoinTableAbcXyzService } from '../service/join-table-abc-xyz.service';

import { JoinTableAbcXyzRoutingResolveService } from './join-table-abc-xyz-routing-resolve.service';

describe('Service Tests', () => {
  describe('JoinTableAbcXyz routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JoinTableAbcXyzRoutingResolveService;
    let service: JoinTableAbcXyzService;
    let resultJoinTableAbcXyz: IJoinTableAbcXyz | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JoinTableAbcXyzRoutingResolveService);
      service = TestBed.inject(JoinTableAbcXyzService);
      resultJoinTableAbcXyz = undefined;
    });

    describe('resolve', () => {
      it('should return IJoinTableAbcXyz returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJoinTableAbcXyz = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJoinTableAbcXyz).toEqual({ id: 123 });
      });

      it('should return new IJoinTableAbcXyz if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJoinTableAbcXyz = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJoinTableAbcXyz).toEqual(new JoinTableAbcXyz());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJoinTableAbcXyz = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJoinTableAbcXyz).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
