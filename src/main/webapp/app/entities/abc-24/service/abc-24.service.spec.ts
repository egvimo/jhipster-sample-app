import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc24, Abc24 } from '../abc-24.model';

import { Abc24Service } from './abc-24.service';

describe('Abc24 Service', () => {
  let service: Abc24Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc24;
  let expectedResult: IAbc24 | IAbc24[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc24Service);
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

    it('should create a Abc24', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc24()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc24', () => {
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

    it('should partial update a Abc24', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc24()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc24', () => {
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

    it('should delete a Abc24', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc24ToCollectionIfMissing', () => {
      it('should add a Abc24 to an empty array', () => {
        const abc24: IAbc24 = { id: 123 };
        expectedResult = service.addAbc24ToCollectionIfMissing([], abc24);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc24);
      });

      it('should not add a Abc24 to an array that contains it', () => {
        const abc24: IAbc24 = { id: 123 };
        const abc24Collection: IAbc24[] = [
          {
            ...abc24,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc24ToCollectionIfMissing(abc24Collection, abc24);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc24 to an array that doesn't contain it", () => {
        const abc24: IAbc24 = { id: 123 };
        const abc24Collection: IAbc24[] = [{ id: 456 }];
        expectedResult = service.addAbc24ToCollectionIfMissing(abc24Collection, abc24);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc24);
      });

      it('should add only unique Abc24 to an array', () => {
        const abc24Array: IAbc24[] = [{ id: 123 }, { id: 456 }, { id: 87487 }];
        const abc24Collection: IAbc24[] = [{ id: 123 }];
        expectedResult = service.addAbc24ToCollectionIfMissing(abc24Collection, ...abc24Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc24: IAbc24 = { id: 123 };
        const abc242: IAbc24 = { id: 456 };
        expectedResult = service.addAbc24ToCollectionIfMissing([], abc24, abc242);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc24);
        expect(expectedResult).toContain(abc242);
      });

      it('should accept null and undefined values', () => {
        const abc24: IAbc24 = { id: 123 };
        expectedResult = service.addAbc24ToCollectionIfMissing([], null, abc24, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc24);
      });

      it('should return initial array if no Abc24 is added', () => {
        const abc24Collection: IAbc24[] = [{ id: 123 }];
        expectedResult = service.addAbc24ToCollectionIfMissing(abc24Collection, undefined, null);
        expect(expectedResult).toEqual(abc24Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
