import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc13, Abc13 } from '../abc-13.model';

import { Abc13Service } from './abc-13.service';

describe('Abc13 Service', () => {
  let service: Abc13Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc13;
  let expectedResult: IAbc13 | IAbc13[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc13Service);
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

    it('should create a Abc13', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc13()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc13', () => {
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

    it('should partial update a Abc13', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Abc13()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc13', () => {
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

    it('should delete a Abc13', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc13ToCollectionIfMissing', () => {
      it('should add a Abc13 to an empty array', () => {
        const abc13: IAbc13 = { id: 123 };
        expectedResult = service.addAbc13ToCollectionIfMissing([], abc13);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc13);
      });

      it('should not add a Abc13 to an array that contains it', () => {
        const abc13: IAbc13 = { id: 123 };
        const abc13Collection: IAbc13[] = [
          {
            ...abc13,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc13ToCollectionIfMissing(abc13Collection, abc13);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc13 to an array that doesn't contain it", () => {
        const abc13: IAbc13 = { id: 123 };
        const abc13Collection: IAbc13[] = [{ id: 456 }];
        expectedResult = service.addAbc13ToCollectionIfMissing(abc13Collection, abc13);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc13);
      });

      it('should add only unique Abc13 to an array', () => {
        const abc13Array: IAbc13[] = [{ id: 123 }, { id: 456 }, { id: 81902 }];
        const abc13Collection: IAbc13[] = [{ id: 123 }];
        expectedResult = service.addAbc13ToCollectionIfMissing(abc13Collection, ...abc13Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc13: IAbc13 = { id: 123 };
        const abc132: IAbc13 = { id: 456 };
        expectedResult = service.addAbc13ToCollectionIfMissing([], abc13, abc132);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc13);
        expect(expectedResult).toContain(abc132);
      });

      it('should accept null and undefined values', () => {
        const abc13: IAbc13 = { id: 123 };
        expectedResult = service.addAbc13ToCollectionIfMissing([], null, abc13, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc13);
      });

      it('should return initial array if no Abc13 is added', () => {
        const abc13Collection: IAbc13[] = [{ id: 123 }];
        expectedResult = service.addAbc13ToCollectionIfMissing(abc13Collection, undefined, null);
        expect(expectedResult).toEqual(abc13Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
