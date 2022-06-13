import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc5, Abc5 } from '../abc-5.model';

import { Abc5Service } from './abc-5.service';

describe('Abc5 Service', () => {
  let service: Abc5Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc5;
  let expectedResult: IAbc5 | IAbc5[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc5Service);
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

    it('should create a Abc5', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc5()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc5', () => {
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

    it('should partial update a Abc5', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc5()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc5', () => {
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

    it('should delete a Abc5', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc5ToCollectionIfMissing', () => {
      it('should add a Abc5 to an empty array', () => {
        const abc5: IAbc5 = { id: 123 };
        expectedResult = service.addAbc5ToCollectionIfMissing([], abc5);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc5);
      });

      it('should not add a Abc5 to an array that contains it', () => {
        const abc5: IAbc5 = { id: 123 };
        const abc5Collection: IAbc5[] = [
          {
            ...abc5,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc5ToCollectionIfMissing(abc5Collection, abc5);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc5 to an array that doesn't contain it", () => {
        const abc5: IAbc5 = { id: 123 };
        const abc5Collection: IAbc5[] = [{ id: 456 }];
        expectedResult = service.addAbc5ToCollectionIfMissing(abc5Collection, abc5);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc5);
      });

      it('should add only unique Abc5 to an array', () => {
        const abc5Array: IAbc5[] = [{ id: 123 }, { id: 456 }, { id: 55876 }];
        const abc5Collection: IAbc5[] = [{ id: 123 }];
        expectedResult = service.addAbc5ToCollectionIfMissing(abc5Collection, ...abc5Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc5: IAbc5 = { id: 123 };
        const abc52: IAbc5 = { id: 456 };
        expectedResult = service.addAbc5ToCollectionIfMissing([], abc5, abc52);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc5);
        expect(expectedResult).toContain(abc52);
      });

      it('should accept null and undefined values', () => {
        const abc5: IAbc5 = { id: 123 };
        expectedResult = service.addAbc5ToCollectionIfMissing([], null, abc5, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc5);
      });

      it('should return initial array if no Abc5 is added', () => {
        const abc5Collection: IAbc5[] = [{ id: 123 }];
        expectedResult = service.addAbc5ToCollectionIfMissing(abc5Collection, undefined, null);
        expect(expectedResult).toEqual(abc5Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
