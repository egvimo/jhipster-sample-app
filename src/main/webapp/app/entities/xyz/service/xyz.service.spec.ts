import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IXyz, Xyz } from '../xyz.model';

import { XyzService } from './xyz.service';

describe('Service Tests', () => {
  describe('Xyz Service', () => {
    let service: XyzService;
    let httpMock: HttpTestingController;
    let elemDefault: IXyz;
    let expectedResult: IXyz | IXyz[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(XyzService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        uniqueField: 'AAAAAAA',
        anotherField: 'AAAAAAA',
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

      it('should create a Xyz', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Xyz()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Xyz', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            uniqueField: 'BBBBBB',
            anotherField: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Xyz', () => {
        const patchObject = Object.assign(
          {
            uniqueField: 'BBBBBB',
          },
          new Xyz()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Xyz', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            uniqueField: 'BBBBBB',
            anotherField: 'BBBBBB',
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

      it('should delete a Xyz', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addXyzToCollectionIfMissing', () => {
        it('should add a Xyz to an empty array', () => {
          const xyz: IXyz = { id: 123 };
          expectedResult = service.addXyzToCollectionIfMissing([], xyz);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(xyz);
        });

        it('should not add a Xyz to an array that contains it', () => {
          const xyz: IXyz = { id: 123 };
          const xyzCollection: IXyz[] = [
            {
              ...xyz,
            },
            { id: 456 },
          ];
          expectedResult = service.addXyzToCollectionIfMissing(xyzCollection, xyz);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Xyz to an array that doesn't contain it", () => {
          const xyz: IXyz = { id: 123 };
          const xyzCollection: IXyz[] = [{ id: 456 }];
          expectedResult = service.addXyzToCollectionIfMissing(xyzCollection, xyz);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(xyz);
        });

        it('should add only unique Xyz to an array', () => {
          const xyzArray: IXyz[] = [{ id: 123 }, { id: 456 }, { id: 30180 }];
          const xyzCollection: IXyz[] = [{ id: 123 }];
          expectedResult = service.addXyzToCollectionIfMissing(xyzCollection, ...xyzArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const xyz: IXyz = { id: 123 };
          const xyz2: IXyz = { id: 456 };
          expectedResult = service.addXyzToCollectionIfMissing([], xyz, xyz2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(xyz);
          expect(expectedResult).toContain(xyz2);
        });

        it('should accept null and undefined values', () => {
          const xyz: IXyz = { id: 123 };
          expectedResult = service.addXyzToCollectionIfMissing([], null, xyz, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(xyz);
        });

        it('should return initial array if no Xyz is added', () => {
          const xyzCollection: IXyz[] = [{ id: 123 }];
          expectedResult = service.addXyzToCollectionIfMissing(xyzCollection, undefined, null);
          expect(expectedResult).toEqual(xyzCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
