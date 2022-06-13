import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc14, Abc14 } from '../abc-14.model';

import { Abc14Service } from './abc-14.service';

describe('Abc14 Service', () => {
  let service: Abc14Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc14;
  let expectedResult: IAbc14 | IAbc14[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc14Service);
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

    it('should create a Abc14', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc14()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc14', () => {
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

    it('should partial update a Abc14', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc14()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc14', () => {
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

    it('should delete a Abc14', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc14ToCollectionIfMissing', () => {
      it('should add a Abc14 to an empty array', () => {
        const abc14: IAbc14 = { id: 123 };
        expectedResult = service.addAbc14ToCollectionIfMissing([], abc14);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc14);
      });

      it('should not add a Abc14 to an array that contains it', () => {
        const abc14: IAbc14 = { id: 123 };
        const abc14Collection: IAbc14[] = [
          {
            ...abc14,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc14ToCollectionIfMissing(abc14Collection, abc14);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc14 to an array that doesn't contain it", () => {
        const abc14: IAbc14 = { id: 123 };
        const abc14Collection: IAbc14[] = [{ id: 456 }];
        expectedResult = service.addAbc14ToCollectionIfMissing(abc14Collection, abc14);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc14);
      });

      it('should add only unique Abc14 to an array', () => {
        const abc14Array: IAbc14[] = [{ id: 123 }, { id: 456 }, { id: 1828 }];
        const abc14Collection: IAbc14[] = [{ id: 123 }];
        expectedResult = service.addAbc14ToCollectionIfMissing(abc14Collection, ...abc14Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc14: IAbc14 = { id: 123 };
        const abc142: IAbc14 = { id: 456 };
        expectedResult = service.addAbc14ToCollectionIfMissing([], abc14, abc142);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc14);
        expect(expectedResult).toContain(abc142);
      });

      it('should accept null and undefined values', () => {
        const abc14: IAbc14 = { id: 123 };
        expectedResult = service.addAbc14ToCollectionIfMissing([], null, abc14, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc14);
      });

      it('should return initial array if no Abc14 is added', () => {
        const abc14Collection: IAbc14[] = [{ id: 123 }];
        expectedResult = service.addAbc14ToCollectionIfMissing(abc14Collection, undefined, null);
        expect(expectedResult).toEqual(abc14Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
