import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc3, Abc3 } from '../abc-3.model';

import { Abc3Service } from './abc-3.service';

describe('Abc3 Service', () => {
  let service: Abc3Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc3;
  let expectedResult: IAbc3 | IAbc3[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc3Service);
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

    it('should create a Abc3', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc3()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc3', () => {
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

    it('should partial update a Abc3', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc3()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc3', () => {
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

    it('should delete a Abc3', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc3ToCollectionIfMissing', () => {
      it('should add a Abc3 to an empty array', () => {
        const abc3: IAbc3 = { id: 123 };
        expectedResult = service.addAbc3ToCollectionIfMissing([], abc3);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc3);
      });

      it('should not add a Abc3 to an array that contains it', () => {
        const abc3: IAbc3 = { id: 123 };
        const abc3Collection: IAbc3[] = [
          {
            ...abc3,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc3ToCollectionIfMissing(abc3Collection, abc3);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc3 to an array that doesn't contain it", () => {
        const abc3: IAbc3 = { id: 123 };
        const abc3Collection: IAbc3[] = [{ id: 456 }];
        expectedResult = service.addAbc3ToCollectionIfMissing(abc3Collection, abc3);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc3);
      });

      it('should add only unique Abc3 to an array', () => {
        const abc3Array: IAbc3[] = [{ id: 123 }, { id: 456 }, { id: 37261 }];
        const abc3Collection: IAbc3[] = [{ id: 123 }];
        expectedResult = service.addAbc3ToCollectionIfMissing(abc3Collection, ...abc3Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc3: IAbc3 = { id: 123 };
        const abc32: IAbc3 = { id: 456 };
        expectedResult = service.addAbc3ToCollectionIfMissing([], abc3, abc32);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc3);
        expect(expectedResult).toContain(abc32);
      });

      it('should accept null and undefined values', () => {
        const abc3: IAbc3 = { id: 123 };
        expectedResult = service.addAbc3ToCollectionIfMissing([], null, abc3, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc3);
      });

      it('should return initial array if no Abc3 is added', () => {
        const abc3Collection: IAbc3[] = [{ id: 123 }];
        expectedResult = service.addAbc3ToCollectionIfMissing(abc3Collection, undefined, null);
        expect(expectedResult).toEqual(abc3Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
