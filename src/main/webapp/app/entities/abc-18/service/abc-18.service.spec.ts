import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc18, Abc18 } from '../abc-18.model';

import { Abc18Service } from './abc-18.service';

describe('Abc18 Service', () => {
  let service: Abc18Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc18;
  let expectedResult: IAbc18 | IAbc18[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc18Service);
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

    it('should create a Abc18', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc18()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc18', () => {
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

    it('should partial update a Abc18', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Abc18()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc18', () => {
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

    it('should delete a Abc18', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc18ToCollectionIfMissing', () => {
      it('should add a Abc18 to an empty array', () => {
        const abc18: IAbc18 = { id: 123 };
        expectedResult = service.addAbc18ToCollectionIfMissing([], abc18);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc18);
      });

      it('should not add a Abc18 to an array that contains it', () => {
        const abc18: IAbc18 = { id: 123 };
        const abc18Collection: IAbc18[] = [
          {
            ...abc18,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc18ToCollectionIfMissing(abc18Collection, abc18);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc18 to an array that doesn't contain it", () => {
        const abc18: IAbc18 = { id: 123 };
        const abc18Collection: IAbc18[] = [{ id: 456 }];
        expectedResult = service.addAbc18ToCollectionIfMissing(abc18Collection, abc18);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc18);
      });

      it('should add only unique Abc18 to an array', () => {
        const abc18Array: IAbc18[] = [{ id: 123 }, { id: 456 }, { id: 84129 }];
        const abc18Collection: IAbc18[] = [{ id: 123 }];
        expectedResult = service.addAbc18ToCollectionIfMissing(abc18Collection, ...abc18Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc18: IAbc18 = { id: 123 };
        const abc182: IAbc18 = { id: 456 };
        expectedResult = service.addAbc18ToCollectionIfMissing([], abc18, abc182);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc18);
        expect(expectedResult).toContain(abc182);
      });

      it('should accept null and undefined values', () => {
        const abc18: IAbc18 = { id: 123 };
        expectedResult = service.addAbc18ToCollectionIfMissing([], null, abc18, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc18);
      });

      it('should return initial array if no Abc18 is added', () => {
        const abc18Collection: IAbc18[] = [{ id: 123 }];
        expectedResult = service.addAbc18ToCollectionIfMissing(abc18Collection, undefined, null);
        expect(expectedResult).toEqual(abc18Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
