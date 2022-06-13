import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc12, Abc12 } from '../abc-12.model';

import { Abc12Service } from './abc-12.service';

describe('Abc12 Service', () => {
  let service: Abc12Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc12;
  let expectedResult: IAbc12 | IAbc12[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc12Service);
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

    it('should create a Abc12', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc12()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc12', () => {
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

    it('should partial update a Abc12', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Abc12()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc12', () => {
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

    it('should delete a Abc12', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc12ToCollectionIfMissing', () => {
      it('should add a Abc12 to an empty array', () => {
        const abc12: IAbc12 = { id: 123 };
        expectedResult = service.addAbc12ToCollectionIfMissing([], abc12);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc12);
      });

      it('should not add a Abc12 to an array that contains it', () => {
        const abc12: IAbc12 = { id: 123 };
        const abc12Collection: IAbc12[] = [
          {
            ...abc12,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc12ToCollectionIfMissing(abc12Collection, abc12);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc12 to an array that doesn't contain it", () => {
        const abc12: IAbc12 = { id: 123 };
        const abc12Collection: IAbc12[] = [{ id: 456 }];
        expectedResult = service.addAbc12ToCollectionIfMissing(abc12Collection, abc12);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc12);
      });

      it('should add only unique Abc12 to an array', () => {
        const abc12Array: IAbc12[] = [{ id: 123 }, { id: 456 }, { id: 40370 }];
        const abc12Collection: IAbc12[] = [{ id: 123 }];
        expectedResult = service.addAbc12ToCollectionIfMissing(abc12Collection, ...abc12Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc12: IAbc12 = { id: 123 };
        const abc122: IAbc12 = { id: 456 };
        expectedResult = service.addAbc12ToCollectionIfMissing([], abc12, abc122);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc12);
        expect(expectedResult).toContain(abc122);
      });

      it('should accept null and undefined values', () => {
        const abc12: IAbc12 = { id: 123 };
        expectedResult = service.addAbc12ToCollectionIfMissing([], null, abc12, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc12);
      });

      it('should return initial array if no Abc12 is added', () => {
        const abc12Collection: IAbc12[] = [{ id: 123 }];
        expectedResult = service.addAbc12ToCollectionIfMissing(abc12Collection, undefined, null);
        expect(expectedResult).toEqual(abc12Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
