import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc10, Abc10 } from '../abc-10.model';

import { Abc10Service } from './abc-10.service';

describe('Abc10 Service', () => {
  let service: Abc10Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc10;
  let expectedResult: IAbc10 | IAbc10[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc10Service);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      otherField: 'AAAAAAA',
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

    it('should create a Abc10', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc10()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc10', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Abc10', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Abc10()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc10', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          otherField: 'BBBBBB',
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

    it('should delete a Abc10', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc10ToCollectionIfMissing', () => {
      it('should add a Abc10 to an empty array', () => {
        const abc10: IAbc10 = { id: 123 };
        expectedResult = service.addAbc10ToCollectionIfMissing([], abc10);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc10);
      });

      it('should not add a Abc10 to an array that contains it', () => {
        const abc10: IAbc10 = { id: 123 };
        const abc10Collection: IAbc10[] = [
          {
            ...abc10,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc10ToCollectionIfMissing(abc10Collection, abc10);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc10 to an array that doesn't contain it", () => {
        const abc10: IAbc10 = { id: 123 };
        const abc10Collection: IAbc10[] = [{ id: 456 }];
        expectedResult = service.addAbc10ToCollectionIfMissing(abc10Collection, abc10);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc10);
      });

      it('should add only unique Abc10 to an array', () => {
        const abc10Array: IAbc10[] = [{ id: 123 }, { id: 456 }, { id: 90406 }];
        const abc10Collection: IAbc10[] = [{ id: 123 }];
        expectedResult = service.addAbc10ToCollectionIfMissing(abc10Collection, ...abc10Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc10: IAbc10 = { id: 123 };
        const abc102: IAbc10 = { id: 456 };
        expectedResult = service.addAbc10ToCollectionIfMissing([], abc10, abc102);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc10);
        expect(expectedResult).toContain(abc102);
      });

      it('should accept null and undefined values', () => {
        const abc10: IAbc10 = { id: 123 };
        expectedResult = service.addAbc10ToCollectionIfMissing([], null, abc10, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc10);
      });

      it('should return initial array if no Abc10 is added', () => {
        const abc10Collection: IAbc10[] = [{ id: 123 }];
        expectedResult = service.addAbc10ToCollectionIfMissing(abc10Collection, undefined, null);
        expect(expectedResult).toEqual(abc10Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
