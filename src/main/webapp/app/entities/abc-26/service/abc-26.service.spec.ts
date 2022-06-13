import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc26, Abc26 } from '../abc-26.model';

import { Abc26Service } from './abc-26.service';

describe('Abc26 Service', () => {
  let service: Abc26Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc26;
  let expectedResult: IAbc26 | IAbc26[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc26Service);
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

    it('should create a Abc26', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc26()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc26', () => {
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

    it('should partial update a Abc26', () => {
      const patchObject = Object.assign(
        {
          otherField: 'BBBBBB',
        },
        new Abc26()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc26', () => {
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

    it('should delete a Abc26', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc26ToCollectionIfMissing', () => {
      it('should add a Abc26 to an empty array', () => {
        const abc26: IAbc26 = { id: 123 };
        expectedResult = service.addAbc26ToCollectionIfMissing([], abc26);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc26);
      });

      it('should not add a Abc26 to an array that contains it', () => {
        const abc26: IAbc26 = { id: 123 };
        const abc26Collection: IAbc26[] = [
          {
            ...abc26,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc26ToCollectionIfMissing(abc26Collection, abc26);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc26 to an array that doesn't contain it", () => {
        const abc26: IAbc26 = { id: 123 };
        const abc26Collection: IAbc26[] = [{ id: 456 }];
        expectedResult = service.addAbc26ToCollectionIfMissing(abc26Collection, abc26);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc26);
      });

      it('should add only unique Abc26 to an array', () => {
        const abc26Array: IAbc26[] = [{ id: 123 }, { id: 456 }, { id: 9540 }];
        const abc26Collection: IAbc26[] = [{ id: 123 }];
        expectedResult = service.addAbc26ToCollectionIfMissing(abc26Collection, ...abc26Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc26: IAbc26 = { id: 123 };
        const abc262: IAbc26 = { id: 456 };
        expectedResult = service.addAbc26ToCollectionIfMissing([], abc26, abc262);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc26);
        expect(expectedResult).toContain(abc262);
      });

      it('should accept null and undefined values', () => {
        const abc26: IAbc26 = { id: 123 };
        expectedResult = service.addAbc26ToCollectionIfMissing([], null, abc26, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc26);
      });

      it('should return initial array if no Abc26 is added', () => {
        const abc26Collection: IAbc26[] = [{ id: 123 }];
        expectedResult = service.addAbc26ToCollectionIfMissing(abc26Collection, undefined, null);
        expect(expectedResult).toEqual(abc26Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
