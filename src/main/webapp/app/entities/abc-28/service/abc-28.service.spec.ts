import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc28, Abc28 } from '../abc-28.model';

import { Abc28Service } from './abc-28.service';

describe('Abc28 Service', () => {
  let service: Abc28Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc28;
  let expectedResult: IAbc28 | IAbc28[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc28Service);
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

    it('should create a Abc28', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc28()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc28', () => {
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

    it('should partial update a Abc28', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Abc28()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc28', () => {
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

    it('should delete a Abc28', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc28ToCollectionIfMissing', () => {
      it('should add a Abc28 to an empty array', () => {
        const abc28: IAbc28 = { id: 123 };
        expectedResult = service.addAbc28ToCollectionIfMissing([], abc28);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc28);
      });

      it('should not add a Abc28 to an array that contains it', () => {
        const abc28: IAbc28 = { id: 123 };
        const abc28Collection: IAbc28[] = [
          {
            ...abc28,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc28ToCollectionIfMissing(abc28Collection, abc28);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc28 to an array that doesn't contain it", () => {
        const abc28: IAbc28 = { id: 123 };
        const abc28Collection: IAbc28[] = [{ id: 456 }];
        expectedResult = service.addAbc28ToCollectionIfMissing(abc28Collection, abc28);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc28);
      });

      it('should add only unique Abc28 to an array', () => {
        const abc28Array: IAbc28[] = [{ id: 123 }, { id: 456 }, { id: 61109 }];
        const abc28Collection: IAbc28[] = [{ id: 123 }];
        expectedResult = service.addAbc28ToCollectionIfMissing(abc28Collection, ...abc28Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc28: IAbc28 = { id: 123 };
        const abc282: IAbc28 = { id: 456 };
        expectedResult = service.addAbc28ToCollectionIfMissing([], abc28, abc282);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc28);
        expect(expectedResult).toContain(abc282);
      });

      it('should accept null and undefined values', () => {
        const abc28: IAbc28 = { id: 123 };
        expectedResult = service.addAbc28ToCollectionIfMissing([], null, abc28, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc28);
      });

      it('should return initial array if no Abc28 is added', () => {
        const abc28Collection: IAbc28[] = [{ id: 123 }];
        expectedResult = service.addAbc28ToCollectionIfMissing(abc28Collection, undefined, null);
        expect(expectedResult).toEqual(abc28Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
