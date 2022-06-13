import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc1, Abc1 } from '../abc-1.model';

import { Abc1Service } from './abc-1.service';

describe('Abc1 Service', () => {
  let service: Abc1Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc1;
  let expectedResult: IAbc1 | IAbc1[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc1Service);
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

    it('should create a Abc1', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc1()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc1', () => {
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

    it('should partial update a Abc1', () => {
      const patchObject = Object.assign(
        {
          otherField: 'BBBBBB',
        },
        new Abc1()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc1', () => {
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

    it('should delete a Abc1', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc1ToCollectionIfMissing', () => {
      it('should add a Abc1 to an empty array', () => {
        const abc1: IAbc1 = { id: 123 };
        expectedResult = service.addAbc1ToCollectionIfMissing([], abc1);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc1);
      });

      it('should not add a Abc1 to an array that contains it', () => {
        const abc1: IAbc1 = { id: 123 };
        const abc1Collection: IAbc1[] = [
          {
            ...abc1,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc1ToCollectionIfMissing(abc1Collection, abc1);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc1 to an array that doesn't contain it", () => {
        const abc1: IAbc1 = { id: 123 };
        const abc1Collection: IAbc1[] = [{ id: 456 }];
        expectedResult = service.addAbc1ToCollectionIfMissing(abc1Collection, abc1);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc1);
      });

      it('should add only unique Abc1 to an array', () => {
        const abc1Array: IAbc1[] = [{ id: 123 }, { id: 456 }, { id: 58408 }];
        const abc1Collection: IAbc1[] = [{ id: 123 }];
        expectedResult = service.addAbc1ToCollectionIfMissing(abc1Collection, ...abc1Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc1: IAbc1 = { id: 123 };
        const abc12: IAbc1 = { id: 456 };
        expectedResult = service.addAbc1ToCollectionIfMissing([], abc1, abc12);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc1);
        expect(expectedResult).toContain(abc12);
      });

      it('should accept null and undefined values', () => {
        const abc1: IAbc1 = { id: 123 };
        expectedResult = service.addAbc1ToCollectionIfMissing([], null, abc1, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc1);
      });

      it('should return initial array if no Abc1 is added', () => {
        const abc1Collection: IAbc1[] = [{ id: 123 }];
        expectedResult = service.addAbc1ToCollectionIfMissing(abc1Collection, undefined, null);
        expect(expectedResult).toEqual(abc1Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
