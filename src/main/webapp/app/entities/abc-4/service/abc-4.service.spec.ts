import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc4, Abc4 } from '../abc-4.model';

import { Abc4Service } from './abc-4.service';

describe('Abc4 Service', () => {
  let service: Abc4Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc4;
  let expectedResult: IAbc4 | IAbc4[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc4Service);
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

    it('should create a Abc4', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc4()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc4', () => {
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

    it('should partial update a Abc4', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc4()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc4', () => {
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

    it('should delete a Abc4', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc4ToCollectionIfMissing', () => {
      it('should add a Abc4 to an empty array', () => {
        const abc4: IAbc4 = { id: 123 };
        expectedResult = service.addAbc4ToCollectionIfMissing([], abc4);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc4);
      });

      it('should not add a Abc4 to an array that contains it', () => {
        const abc4: IAbc4 = { id: 123 };
        const abc4Collection: IAbc4[] = [
          {
            ...abc4,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc4ToCollectionIfMissing(abc4Collection, abc4);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc4 to an array that doesn't contain it", () => {
        const abc4: IAbc4 = { id: 123 };
        const abc4Collection: IAbc4[] = [{ id: 456 }];
        expectedResult = service.addAbc4ToCollectionIfMissing(abc4Collection, abc4);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc4);
      });

      it('should add only unique Abc4 to an array', () => {
        const abc4Array: IAbc4[] = [{ id: 123 }, { id: 456 }, { id: 19603 }];
        const abc4Collection: IAbc4[] = [{ id: 123 }];
        expectedResult = service.addAbc4ToCollectionIfMissing(abc4Collection, ...abc4Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc4: IAbc4 = { id: 123 };
        const abc42: IAbc4 = { id: 456 };
        expectedResult = service.addAbc4ToCollectionIfMissing([], abc4, abc42);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc4);
        expect(expectedResult).toContain(abc42);
      });

      it('should accept null and undefined values', () => {
        const abc4: IAbc4 = { id: 123 };
        expectedResult = service.addAbc4ToCollectionIfMissing([], null, abc4, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc4);
      });

      it('should return initial array if no Abc4 is added', () => {
        const abc4Collection: IAbc4[] = [{ id: 123 }];
        expectedResult = service.addAbc4ToCollectionIfMissing(abc4Collection, undefined, null);
        expect(expectedResult).toEqual(abc4Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
