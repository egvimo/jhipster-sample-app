import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc, Abc } from '../abc.model';

import { AbcService } from './abc.service';

describe('Service Tests', () => {
  describe('Abc Service', () => {
    let service: AbcService;
    let httpMock: HttpTestingController;
    let elemDefault: IAbc;
    let expectedResult: IAbc | IAbc[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AbcService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
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

      it('should create a Abc', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Abc()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Abc', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Abc', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Abc()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Abc', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should delete a Abc', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAbcToCollectionIfMissing', () => {
        it('should add a Abc to an empty array', () => {
          const abc: IAbc = { id: 123 };
          expectedResult = service.addAbcToCollectionIfMissing([], abc);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(abc);
        });

        it('should not add a Abc to an array that contains it', () => {
          const abc: IAbc = { id: 123 };
          const abcCollection: IAbc[] = [
            {
              ...abc,
            },
            { id: 456 },
          ];
          expectedResult = service.addAbcToCollectionIfMissing(abcCollection, abc);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Abc to an array that doesn't contain it", () => {
          const abc: IAbc = { id: 123 };
          const abcCollection: IAbc[] = [{ id: 456 }];
          expectedResult = service.addAbcToCollectionIfMissing(abcCollection, abc);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(abc);
        });

        it('should add only unique Abc to an array', () => {
          const abcArray: IAbc[] = [{ id: 123 }, { id: 456 }, { id: 44999 }];
          const abcCollection: IAbc[] = [{ id: 123 }];
          expectedResult = service.addAbcToCollectionIfMissing(abcCollection, ...abcArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const abc: IAbc = { id: 123 };
          const abc2: IAbc = { id: 456 };
          expectedResult = service.addAbcToCollectionIfMissing([], abc, abc2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(abc);
          expect(expectedResult).toContain(abc2);
        });

        it('should accept null and undefined values', () => {
          const abc: IAbc = { id: 123 };
          expectedResult = service.addAbcToCollectionIfMissing([], null, abc, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(abc);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
