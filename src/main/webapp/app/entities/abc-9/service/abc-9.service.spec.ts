import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc9, Abc9 } from '../abc-9.model';

import { Abc9Service } from './abc-9.service';

describe('Abc9 Service', () => {
  let service: Abc9Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc9;
  let expectedResult: IAbc9 | IAbc9[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc9Service);
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

    it('should create a Abc9', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc9()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc9', () => {
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

    it('should partial update a Abc9', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc9()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc9', () => {
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

    it('should delete a Abc9', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc9ToCollectionIfMissing', () => {
      it('should add a Abc9 to an empty array', () => {
        const abc9: IAbc9 = { id: 123 };
        expectedResult = service.addAbc9ToCollectionIfMissing([], abc9);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc9);
      });

      it('should not add a Abc9 to an array that contains it', () => {
        const abc9: IAbc9 = { id: 123 };
        const abc9Collection: IAbc9[] = [
          {
            ...abc9,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc9ToCollectionIfMissing(abc9Collection, abc9);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc9 to an array that doesn't contain it", () => {
        const abc9: IAbc9 = { id: 123 };
        const abc9Collection: IAbc9[] = [{ id: 456 }];
        expectedResult = service.addAbc9ToCollectionIfMissing(abc9Collection, abc9);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc9);
      });

      it('should add only unique Abc9 to an array', () => {
        const abc9Array: IAbc9[] = [{ id: 123 }, { id: 456 }, { id: 16185 }];
        const abc9Collection: IAbc9[] = [{ id: 123 }];
        expectedResult = service.addAbc9ToCollectionIfMissing(abc9Collection, ...abc9Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc9: IAbc9 = { id: 123 };
        const abc92: IAbc9 = { id: 456 };
        expectedResult = service.addAbc9ToCollectionIfMissing([], abc9, abc92);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc9);
        expect(expectedResult).toContain(abc92);
      });

      it('should accept null and undefined values', () => {
        const abc9: IAbc9 = { id: 123 };
        expectedResult = service.addAbc9ToCollectionIfMissing([], null, abc9, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc9);
      });

      it('should return initial array if no Abc9 is added', () => {
        const abc9Collection: IAbc9[] = [{ id: 123 }];
        expectedResult = service.addAbc9ToCollectionIfMissing(abc9Collection, undefined, null);
        expect(expectedResult).toEqual(abc9Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
