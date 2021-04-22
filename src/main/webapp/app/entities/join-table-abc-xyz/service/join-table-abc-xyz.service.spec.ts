import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJoinTableAbcXyz, JoinTableAbcXyz } from '../join-table-abc-xyz.model';

import { JoinTableAbcXyzService } from './join-table-abc-xyz.service';

describe('Service Tests', () => {
  describe('JoinTableAbcXyz Service', () => {
    let service: JoinTableAbcXyzService;
    let httpMock: HttpTestingController;
    let elemDefault: IJoinTableAbcXyz;
    let expectedResult: IJoinTableAbcXyz | IJoinTableAbcXyz[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(JoinTableAbcXyzService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        additionalColumn: 'AAAAAAA',
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

      it('should create a JoinTableAbcXyz', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new JoinTableAbcXyz()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a JoinTableAbcXyz', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            additionalColumn: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a JoinTableAbcXyz', () => {
        const patchObject = Object.assign({}, new JoinTableAbcXyz());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of JoinTableAbcXyz', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            additionalColumn: 'BBBBBB',
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

      it('should delete a JoinTableAbcXyz', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addJoinTableAbcXyzToCollectionIfMissing', () => {
        it('should add a JoinTableAbcXyz to an empty array', () => {
          const joinTableAbcXyz: IJoinTableAbcXyz = { id: 123 };
          expectedResult = service.addJoinTableAbcXyzToCollectionIfMissing([], joinTableAbcXyz);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(joinTableAbcXyz);
        });

        it('should not add a JoinTableAbcXyz to an array that contains it', () => {
          const joinTableAbcXyz: IJoinTableAbcXyz = { id: 123 };
          const joinTableAbcXyzCollection: IJoinTableAbcXyz[] = [
            {
              ...joinTableAbcXyz,
            },
            { id: 456 },
          ];
          expectedResult = service.addJoinTableAbcXyzToCollectionIfMissing(joinTableAbcXyzCollection, joinTableAbcXyz);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a JoinTableAbcXyz to an array that doesn't contain it", () => {
          const joinTableAbcXyz: IJoinTableAbcXyz = { id: 123 };
          const joinTableAbcXyzCollection: IJoinTableAbcXyz[] = [{ id: 456 }];
          expectedResult = service.addJoinTableAbcXyzToCollectionIfMissing(joinTableAbcXyzCollection, joinTableAbcXyz);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(joinTableAbcXyz);
        });

        it('should add only unique JoinTableAbcXyz to an array', () => {
          const joinTableAbcXyzArray: IJoinTableAbcXyz[] = [{ id: 123 }, { id: 456 }, { id: 57282 }];
          const joinTableAbcXyzCollection: IJoinTableAbcXyz[] = [{ id: 123 }];
          expectedResult = service.addJoinTableAbcXyzToCollectionIfMissing(joinTableAbcXyzCollection, ...joinTableAbcXyzArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const joinTableAbcXyz: IJoinTableAbcXyz = { id: 123 };
          const joinTableAbcXyz2: IJoinTableAbcXyz = { id: 456 };
          expectedResult = service.addJoinTableAbcXyzToCollectionIfMissing([], joinTableAbcXyz, joinTableAbcXyz2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(joinTableAbcXyz);
          expect(expectedResult).toContain(joinTableAbcXyz2);
        });

        it('should accept null and undefined values', () => {
          const joinTableAbcXyz: IJoinTableAbcXyz = { id: 123 };
          expectedResult = service.addJoinTableAbcXyzToCollectionIfMissing([], null, joinTableAbcXyz, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(joinTableAbcXyz);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
