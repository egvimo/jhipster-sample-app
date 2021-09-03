import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDef, Def } from '../def.model';

import { DefService } from './def.service';

describe('Service Tests', () => {
  describe('Def Service', () => {
    let service: DefService;
    let httpMock: HttpTestingController;
    let elemDefault: IDef;
    let expectedResult: IDef | IDef[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DefService);
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

      it('should create a Def', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Def()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Def', () => {
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

      it('should partial update a Def', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Def()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Def', () => {
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

      it('should delete a Def', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDefToCollectionIfMissing', () => {
        it('should add a Def to an empty array', () => {
          const def: IDef = { id: 123 };
          expectedResult = service.addDefToCollectionIfMissing([], def);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(def);
        });

        it('should not add a Def to an array that contains it', () => {
          const def: IDef = { id: 123 };
          const defCollection: IDef[] = [
            {
              ...def,
            },
            { id: 456 },
          ];
          expectedResult = service.addDefToCollectionIfMissing(defCollection, def);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Def to an array that doesn't contain it", () => {
          const def: IDef = { id: 123 };
          const defCollection: IDef[] = [{ id: 456 }];
          expectedResult = service.addDefToCollectionIfMissing(defCollection, def);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(def);
        });

        it('should add only unique Def to an array', () => {
          const defArray: IDef[] = [{ id: 123 }, { id: 456 }, { id: 23682 }];
          const defCollection: IDef[] = [{ id: 123 }];
          expectedResult = service.addDefToCollectionIfMissing(defCollection, ...defArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const def: IDef = { id: 123 };
          const def2: IDef = { id: 456 };
          expectedResult = service.addDefToCollectionIfMissing([], def, def2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(def);
          expect(expectedResult).toContain(def2);
        });

        it('should accept null and undefined values', () => {
          const def: IDef = { id: 123 };
          expectedResult = service.addDefToCollectionIfMissing([], null, def, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(def);
        });

        it('should return initial array if no Def is added', () => {
          const defCollection: IDef[] = [{ id: 123 }];
          expectedResult = service.addDefToCollectionIfMissing(defCollection, undefined, null);
          expect(expectedResult).toEqual(defCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
