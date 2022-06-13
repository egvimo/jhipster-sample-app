import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc11, Abc11 } from '../abc-11.model';

import { Abc11Service } from './abc-11.service';

describe('Abc11 Service', () => {
  let service: Abc11Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc11;
  let expectedResult: IAbc11 | IAbc11[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc11Service);
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

    it('should create a Abc11', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc11()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc11', () => {
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

    it('should partial update a Abc11', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc11()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc11', () => {
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

    it('should delete a Abc11', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc11ToCollectionIfMissing', () => {
      it('should add a Abc11 to an empty array', () => {
        const abc11: IAbc11 = { id: 123 };
        expectedResult = service.addAbc11ToCollectionIfMissing([], abc11);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc11);
      });

      it('should not add a Abc11 to an array that contains it', () => {
        const abc11: IAbc11 = { id: 123 };
        const abc11Collection: IAbc11[] = [
          {
            ...abc11,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc11ToCollectionIfMissing(abc11Collection, abc11);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc11 to an array that doesn't contain it", () => {
        const abc11: IAbc11 = { id: 123 };
        const abc11Collection: IAbc11[] = [{ id: 456 }];
        expectedResult = service.addAbc11ToCollectionIfMissing(abc11Collection, abc11);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc11);
      });

      it('should add only unique Abc11 to an array', () => {
        const abc11Array: IAbc11[] = [{ id: 123 }, { id: 456 }, { id: 6199 }];
        const abc11Collection: IAbc11[] = [{ id: 123 }];
        expectedResult = service.addAbc11ToCollectionIfMissing(abc11Collection, ...abc11Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc11: IAbc11 = { id: 123 };
        const abc112: IAbc11 = { id: 456 };
        expectedResult = service.addAbc11ToCollectionIfMissing([], abc11, abc112);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc11);
        expect(expectedResult).toContain(abc112);
      });

      it('should accept null and undefined values', () => {
        const abc11: IAbc11 = { id: 123 };
        expectedResult = service.addAbc11ToCollectionIfMissing([], null, abc11, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc11);
      });

      it('should return initial array if no Abc11 is added', () => {
        const abc11Collection: IAbc11[] = [{ id: 123 }];
        expectedResult = service.addAbc11ToCollectionIfMissing(abc11Collection, undefined, null);
        expect(expectedResult).toEqual(abc11Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
