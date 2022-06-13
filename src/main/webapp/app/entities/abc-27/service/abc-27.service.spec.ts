import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc27, Abc27 } from '../abc-27.model';

import { Abc27Service } from './abc-27.service';

describe('Abc27 Service', () => {
  let service: Abc27Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc27;
  let expectedResult: IAbc27 | IAbc27[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc27Service);
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

    it('should create a Abc27', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc27()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc27', () => {
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

    it('should partial update a Abc27', () => {
      const patchObject = Object.assign({}, new Abc27());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc27', () => {
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

    it('should delete a Abc27', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc27ToCollectionIfMissing', () => {
      it('should add a Abc27 to an empty array', () => {
        const abc27: IAbc27 = { id: 123 };
        expectedResult = service.addAbc27ToCollectionIfMissing([], abc27);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc27);
      });

      it('should not add a Abc27 to an array that contains it', () => {
        const abc27: IAbc27 = { id: 123 };
        const abc27Collection: IAbc27[] = [
          {
            ...abc27,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc27ToCollectionIfMissing(abc27Collection, abc27);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc27 to an array that doesn't contain it", () => {
        const abc27: IAbc27 = { id: 123 };
        const abc27Collection: IAbc27[] = [{ id: 456 }];
        expectedResult = service.addAbc27ToCollectionIfMissing(abc27Collection, abc27);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc27);
      });

      it('should add only unique Abc27 to an array', () => {
        const abc27Array: IAbc27[] = [{ id: 123 }, { id: 456 }, { id: 65527 }];
        const abc27Collection: IAbc27[] = [{ id: 123 }];
        expectedResult = service.addAbc27ToCollectionIfMissing(abc27Collection, ...abc27Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc27: IAbc27 = { id: 123 };
        const abc272: IAbc27 = { id: 456 };
        expectedResult = service.addAbc27ToCollectionIfMissing([], abc27, abc272);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc27);
        expect(expectedResult).toContain(abc272);
      });

      it('should accept null and undefined values', () => {
        const abc27: IAbc27 = { id: 123 };
        expectedResult = service.addAbc27ToCollectionIfMissing([], null, abc27, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc27);
      });

      it('should return initial array if no Abc27 is added', () => {
        const abc27Collection: IAbc27[] = [{ id: 123 }];
        expectedResult = service.addAbc27ToCollectionIfMissing(abc27Collection, undefined, null);
        expect(expectedResult).toEqual(abc27Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
