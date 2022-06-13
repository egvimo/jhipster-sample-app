import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc8, Abc8 } from '../abc-8.model';

import { Abc8Service } from './abc-8.service';

describe('Abc8 Service', () => {
  let service: Abc8Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc8;
  let expectedResult: IAbc8 | IAbc8[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc8Service);
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

    it('should create a Abc8', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc8()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc8', () => {
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

    it('should partial update a Abc8', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc8()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc8', () => {
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

    it('should delete a Abc8', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc8ToCollectionIfMissing', () => {
      it('should add a Abc8 to an empty array', () => {
        const abc8: IAbc8 = { id: 123 };
        expectedResult = service.addAbc8ToCollectionIfMissing([], abc8);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc8);
      });

      it('should not add a Abc8 to an array that contains it', () => {
        const abc8: IAbc8 = { id: 123 };
        const abc8Collection: IAbc8[] = [
          {
            ...abc8,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc8ToCollectionIfMissing(abc8Collection, abc8);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc8 to an array that doesn't contain it", () => {
        const abc8: IAbc8 = { id: 123 };
        const abc8Collection: IAbc8[] = [{ id: 456 }];
        expectedResult = service.addAbc8ToCollectionIfMissing(abc8Collection, abc8);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc8);
      });

      it('should add only unique Abc8 to an array', () => {
        const abc8Array: IAbc8[] = [{ id: 123 }, { id: 456 }, { id: 35218 }];
        const abc8Collection: IAbc8[] = [{ id: 123 }];
        expectedResult = service.addAbc8ToCollectionIfMissing(abc8Collection, ...abc8Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc8: IAbc8 = { id: 123 };
        const abc82: IAbc8 = { id: 456 };
        expectedResult = service.addAbc8ToCollectionIfMissing([], abc8, abc82);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc8);
        expect(expectedResult).toContain(abc82);
      });

      it('should accept null and undefined values', () => {
        const abc8: IAbc8 = { id: 123 };
        expectedResult = service.addAbc8ToCollectionIfMissing([], null, abc8, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc8);
      });

      it('should return initial array if no Abc8 is added', () => {
        const abc8Collection: IAbc8[] = [{ id: 123 }];
        expectedResult = service.addAbc8ToCollectionIfMissing(abc8Collection, undefined, null);
        expect(expectedResult).toEqual(abc8Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
