import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc2, Abc2 } from '../abc-2.model';

import { Abc2Service } from './abc-2.service';

describe('Abc2 Service', () => {
  let service: Abc2Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc2;
  let expectedResult: IAbc2 | IAbc2[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc2Service);
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

    it('should create a Abc2', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc2()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc2', () => {
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

    it('should partial update a Abc2', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc2()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc2', () => {
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

    it('should delete a Abc2', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc2ToCollectionIfMissing', () => {
      it('should add a Abc2 to an empty array', () => {
        const abc2: IAbc2 = { id: 123 };
        expectedResult = service.addAbc2ToCollectionIfMissing([], abc2);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc2);
      });

      it('should not add a Abc2 to an array that contains it', () => {
        const abc2: IAbc2 = { id: 123 };
        const abc2Collection: IAbc2[] = [
          {
            ...abc2,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc2ToCollectionIfMissing(abc2Collection, abc2);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc2 to an array that doesn't contain it", () => {
        const abc2: IAbc2 = { id: 123 };
        const abc2Collection: IAbc2[] = [{ id: 456 }];
        expectedResult = service.addAbc2ToCollectionIfMissing(abc2Collection, abc2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc2);
      });

      it('should add only unique Abc2 to an array', () => {
        const abc2Array: IAbc2[] = [{ id: 123 }, { id: 456 }, { id: 14970 }];
        const abc2Collection: IAbc2[] = [{ id: 123 }];
        expectedResult = service.addAbc2ToCollectionIfMissing(abc2Collection, ...abc2Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc2: IAbc2 = { id: 123 };
        const abc22: IAbc2 = { id: 456 };
        expectedResult = service.addAbc2ToCollectionIfMissing([], abc2, abc22);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc2);
        expect(expectedResult).toContain(abc22);
      });

      it('should accept null and undefined values', () => {
        const abc2: IAbc2 = { id: 123 };
        expectedResult = service.addAbc2ToCollectionIfMissing([], null, abc2, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc2);
      });

      it('should return initial array if no Abc2 is added', () => {
        const abc2Collection: IAbc2[] = [{ id: 123 }];
        expectedResult = service.addAbc2ToCollectionIfMissing(abc2Collection, undefined, null);
        expect(expectedResult).toEqual(abc2Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
