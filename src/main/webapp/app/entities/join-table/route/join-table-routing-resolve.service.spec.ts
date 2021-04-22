jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJoinTable, JoinTable } from '../join-table.model';
import { JoinTableService } from '../service/join-table.service';

import { JoinTableRoutingResolveService } from './join-table-routing-resolve.service';

describe('Service Tests', () => {
  describe('JoinTable routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JoinTableRoutingResolveService;
    let service: JoinTableService;
    let resultJoinTable: IJoinTable | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JoinTableRoutingResolveService);
      service = TestBed.inject(JoinTableService);
      resultJoinTable = undefined;
    });

    describe('resolve', () => {
      it('should return IJoinTable returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJoinTable = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJoinTable).toEqual({ id: 123 });
      });

      it('should return new IJoinTable if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJoinTable = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJoinTable).toEqual(new JoinTable());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJoinTable = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJoinTable).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
