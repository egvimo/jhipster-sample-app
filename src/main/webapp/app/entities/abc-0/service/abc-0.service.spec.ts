import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc0 } from '../abc-0.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../abc-0.test-samples';

import { Abc0Service } from './abc-0.service';

const requireRestSample: IAbc0 = {
  ...sampleWithRequiredData,
};

describe('Abc0 Service', () => {
  let service: Abc0Service;
  let httpMock: HttpTestingController;
  let expectedResult: IAbc0 | IAbc0[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc0Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Abc0', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const abc0 = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(abc0).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc0', () => {
      const abc0 = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(abc0).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Abc0', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc0', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Abc0', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAbc0ToCollectionIfMissing', () => {
      it('should add a Abc0 to an empty array', () => {
        const abc0: IAbc0 = sampleWithRequiredData;
        expectedResult = service.addAbc0ToCollectionIfMissing([], abc0);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc0);
      });

      it('should not add a Abc0 to an array that contains it', () => {
        const abc0: IAbc0 = sampleWithRequiredData;
        const abc0Collection: IAbc0[] = [
          {
            ...abc0,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAbc0ToCollectionIfMissing(abc0Collection, abc0);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc0 to an array that doesn't contain it", () => {
        const abc0: IAbc0 = sampleWithRequiredData;
        const abc0Collection: IAbc0[] = [sampleWithPartialData];
        expectedResult = service.addAbc0ToCollectionIfMissing(abc0Collection, abc0);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc0);
      });

      it('should add only unique Abc0 to an array', () => {
        const abc0Array: IAbc0[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const abc0Collection: IAbc0[] = [sampleWithRequiredData];
        expectedResult = service.addAbc0ToCollectionIfMissing(abc0Collection, ...abc0Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc0: IAbc0 = sampleWithRequiredData;
        const abc02: IAbc0 = sampleWithPartialData;
        expectedResult = service.addAbc0ToCollectionIfMissing([], abc0, abc02);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc0);
        expect(expectedResult).toContain(abc02);
      });

      it('should accept null and undefined values', () => {
        const abc0: IAbc0 = sampleWithRequiredData;
        expectedResult = service.addAbc0ToCollectionIfMissing([], null, abc0, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc0);
      });

      it('should return initial array if no Abc0 is added', () => {
        const abc0Collection: IAbc0[] = [sampleWithRequiredData];
        expectedResult = service.addAbc0ToCollectionIfMissing(abc0Collection, undefined, null);
        expect(expectedResult).toEqual(abc0Collection);
      });
    });

    describe('compareAbc0', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAbc0(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAbc0(entity1, entity2);
        const compareResult2 = service.compareAbc0(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAbc0(entity1, entity2);
        const compareResult2 = service.compareAbc0(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAbc0(entity1, entity2);
        const compareResult2 = service.compareAbc0(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
