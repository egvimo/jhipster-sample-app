import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc6, Abc6 } from '../abc-6.model';

import { Abc6Service } from './abc-6.service';

describe('Abc6 Service', () => {
  let service: Abc6Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc6;
  let expectedResult: IAbc6 | IAbc6[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc6Service);
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

    it('should create a Abc6', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc6()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc6', () => {
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

    it('should partial update a Abc6', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc6()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc6', () => {
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

    it('should delete a Abc6', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc6ToCollectionIfMissing', () => {
      it('should add a Abc6 to an empty array', () => {
        const abc6: IAbc6 = { id: 123 };
        expectedResult = service.addAbc6ToCollectionIfMissing([], abc6);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc6);
      });

      it('should not add a Abc6 to an array that contains it', () => {
        const abc6: IAbc6 = { id: 123 };
        const abc6Collection: IAbc6[] = [
          {
            ...abc6,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc6ToCollectionIfMissing(abc6Collection, abc6);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc6 to an array that doesn't contain it", () => {
        const abc6: IAbc6 = { id: 123 };
        const abc6Collection: IAbc6[] = [{ id: 456 }];
        expectedResult = service.addAbc6ToCollectionIfMissing(abc6Collection, abc6);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc6);
      });

      it('should add only unique Abc6 to an array', () => {
        const abc6Array: IAbc6[] = [{ id: 123 }, { id: 456 }, { id: 78541 }];
        const abc6Collection: IAbc6[] = [{ id: 123 }];
        expectedResult = service.addAbc6ToCollectionIfMissing(abc6Collection, ...abc6Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc6: IAbc6 = { id: 123 };
        const abc62: IAbc6 = { id: 456 };
        expectedResult = service.addAbc6ToCollectionIfMissing([], abc6, abc62);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc6);
        expect(expectedResult).toContain(abc62);
      });

      it('should accept null and undefined values', () => {
        const abc6: IAbc6 = { id: 123 };
        expectedResult = service.addAbc6ToCollectionIfMissing([], null, abc6, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc6);
      });

      it('should return initial array if no Abc6 is added', () => {
        const abc6Collection: IAbc6[] = [{ id: 123 }];
        expectedResult = service.addAbc6ToCollectionIfMissing(abc6Collection, undefined, null);
        expect(expectedResult).toEqual(abc6Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
