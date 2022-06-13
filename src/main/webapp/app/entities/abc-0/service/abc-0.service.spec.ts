import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc0, Abc0 } from '../abc-0.model';

import { Abc0Service } from './abc-0.service';

describe('Abc0 Service', () => {
  let service: Abc0Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc0;
  let expectedResult: IAbc0 | IAbc0[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc0Service);
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

    it('should create a Abc0', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc0()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc0', () => {
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

    it('should partial update a Abc0', () => {
      const patchObject = Object.assign({}, new Abc0());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc0', () => {
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

    it('should delete a Abc0', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc0ToCollectionIfMissing', () => {
      it('should add a Abc0 to an empty array', () => {
        const abc0: IAbc0 = { id: 123 };
        expectedResult = service.addAbc0ToCollectionIfMissing([], abc0);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc0);
      });

      it('should not add a Abc0 to an array that contains it', () => {
        const abc0: IAbc0 = { id: 123 };
        const abc0Collection: IAbc0[] = [
          {
            ...abc0,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc0ToCollectionIfMissing(abc0Collection, abc0);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc0 to an array that doesn't contain it", () => {
        const abc0: IAbc0 = { id: 123 };
        const abc0Collection: IAbc0[] = [{ id: 456 }];
        expectedResult = service.addAbc0ToCollectionIfMissing(abc0Collection, abc0);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc0);
      });

      it('should add only unique Abc0 to an array', () => {
        const abc0Array: IAbc0[] = [{ id: 123 }, { id: 456 }, { id: 81485 }];
        const abc0Collection: IAbc0[] = [{ id: 123 }];
        expectedResult = service.addAbc0ToCollectionIfMissing(abc0Collection, ...abc0Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc0: IAbc0 = { id: 123 };
        const abc02: IAbc0 = { id: 456 };
        expectedResult = service.addAbc0ToCollectionIfMissing([], abc0, abc02);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc0);
        expect(expectedResult).toContain(abc02);
      });

      it('should accept null and undefined values', () => {
        const abc0: IAbc0 = { id: 123 };
        expectedResult = service.addAbc0ToCollectionIfMissing([], null, abc0, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc0);
      });

      it('should return initial array if no Abc0 is added', () => {
        const abc0Collection: IAbc0[] = [{ id: 123 }];
        expectedResult = service.addAbc0ToCollectionIfMissing(abc0Collection, undefined, null);
        expect(expectedResult).toEqual(abc0Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
