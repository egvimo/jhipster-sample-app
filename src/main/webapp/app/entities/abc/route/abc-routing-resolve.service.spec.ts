jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAbc, Abc } from '../abc.model';
import { AbcService } from '../service/abc.service';

import { AbcRoutingResolveService } from './abc-routing-resolve.service';

describe('Service Tests', () => {
  describe('Abc routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AbcRoutingResolveService;
    let service: AbcService;
    let resultAbc: IAbc | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AbcRoutingResolveService);
      service = TestBed.inject(AbcService);
      resultAbc = undefined;
    });

    describe('resolve', () => {
      it('should return IAbc returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAbc = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAbc).toEqual({ id: 123 });
      });

      it('should return new IAbc if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAbc = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAbc).toEqual(new Abc());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Abc })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAbc = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAbc).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
