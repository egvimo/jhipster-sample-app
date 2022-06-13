import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc23, Abc23 } from '../abc-23.model';

import { Abc23Service } from './abc-23.service';

describe('Abc23 Service', () => {
  let service: Abc23Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc23;
  let expectedResult: IAbc23 | IAbc23[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc23Service);
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

    it('should create a Abc23', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc23()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc23', () => {
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

    it('should partial update a Abc23', () => {
      const patchObject = Object.assign({}, new Abc23());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc23', () => {
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

    it('should delete a Abc23', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc23ToCollectionIfMissing', () => {
      it('should add a Abc23 to an empty array', () => {
        const abc23: IAbc23 = { id: 123 };
        expectedResult = service.addAbc23ToCollectionIfMissing([], abc23);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc23);
      });

      it('should not add a Abc23 to an array that contains it', () => {
        const abc23: IAbc23 = { id: 123 };
        const abc23Collection: IAbc23[] = [
          {
            ...abc23,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc23ToCollectionIfMissing(abc23Collection, abc23);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc23 to an array that doesn't contain it", () => {
        const abc23: IAbc23 = { id: 123 };
        const abc23Collection: IAbc23[] = [{ id: 456 }];
        expectedResult = service.addAbc23ToCollectionIfMissing(abc23Collection, abc23);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc23);
      });

      it('should add only unique Abc23 to an array', () => {
        const abc23Array: IAbc23[] = [{ id: 123 }, { id: 456 }, { id: 31609 }];
        const abc23Collection: IAbc23[] = [{ id: 123 }];
        expectedResult = service.addAbc23ToCollectionIfMissing(abc23Collection, ...abc23Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc23: IAbc23 = { id: 123 };
        const abc232: IAbc23 = { id: 456 };
        expectedResult = service.addAbc23ToCollectionIfMissing([], abc23, abc232);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc23);
        expect(expectedResult).toContain(abc232);
      });

      it('should accept null and undefined values', () => {
        const abc23: IAbc23 = { id: 123 };
        expectedResult = service.addAbc23ToCollectionIfMissing([], null, abc23, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc23);
      });

      it('should return initial array if no Abc23 is added', () => {
        const abc23Collection: IAbc23[] = [{ id: 123 }];
        expectedResult = service.addAbc23ToCollectionIfMissing(abc23Collection, undefined, null);
        expect(expectedResult).toEqual(abc23Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
