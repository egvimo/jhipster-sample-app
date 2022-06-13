import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc17, Abc17 } from '../abc-17.model';

import { Abc17Service } from './abc-17.service';

describe('Abc17 Service', () => {
  let service: Abc17Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc17;
  let expectedResult: IAbc17 | IAbc17[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc17Service);
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

    it('should create a Abc17', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc17()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc17', () => {
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

    it('should partial update a Abc17', () => {
      const patchObject = Object.assign(
        {
          otherField: 'BBBBBB',
        },
        new Abc17()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc17', () => {
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

    it('should delete a Abc17', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc17ToCollectionIfMissing', () => {
      it('should add a Abc17 to an empty array', () => {
        const abc17: IAbc17 = { id: 123 };
        expectedResult = service.addAbc17ToCollectionIfMissing([], abc17);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc17);
      });

      it('should not add a Abc17 to an array that contains it', () => {
        const abc17: IAbc17 = { id: 123 };
        const abc17Collection: IAbc17[] = [
          {
            ...abc17,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc17ToCollectionIfMissing(abc17Collection, abc17);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc17 to an array that doesn't contain it", () => {
        const abc17: IAbc17 = { id: 123 };
        const abc17Collection: IAbc17[] = [{ id: 456 }];
        expectedResult = service.addAbc17ToCollectionIfMissing(abc17Collection, abc17);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc17);
      });

      it('should add only unique Abc17 to an array', () => {
        const abc17Array: IAbc17[] = [{ id: 123 }, { id: 456 }, { id: 82317 }];
        const abc17Collection: IAbc17[] = [{ id: 123 }];
        expectedResult = service.addAbc17ToCollectionIfMissing(abc17Collection, ...abc17Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc17: IAbc17 = { id: 123 };
        const abc172: IAbc17 = { id: 456 };
        expectedResult = service.addAbc17ToCollectionIfMissing([], abc17, abc172);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc17);
        expect(expectedResult).toContain(abc172);
      });

      it('should accept null and undefined values', () => {
        const abc17: IAbc17 = { id: 123 };
        expectedResult = service.addAbc17ToCollectionIfMissing([], null, abc17, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc17);
      });

      it('should return initial array if no Abc17 is added', () => {
        const abc17Collection: IAbc17[] = [{ id: 123 }];
        expectedResult = service.addAbc17ToCollectionIfMissing(abc17Collection, undefined, null);
        expect(expectedResult).toEqual(abc17Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
