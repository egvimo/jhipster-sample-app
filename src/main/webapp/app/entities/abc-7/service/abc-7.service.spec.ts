import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc7, Abc7 } from '../abc-7.model';

import { Abc7Service } from './abc-7.service';

describe('Abc7 Service', () => {
  let service: Abc7Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc7;
  let expectedResult: IAbc7 | IAbc7[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc7Service);
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

    it('should create a Abc7', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc7()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc7', () => {
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

    it('should partial update a Abc7', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Abc7()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc7', () => {
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

    it('should delete a Abc7', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc7ToCollectionIfMissing', () => {
      it('should add a Abc7 to an empty array', () => {
        const abc7: IAbc7 = { id: 123 };
        expectedResult = service.addAbc7ToCollectionIfMissing([], abc7);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc7);
      });

      it('should not add a Abc7 to an array that contains it', () => {
        const abc7: IAbc7 = { id: 123 };
        const abc7Collection: IAbc7[] = [
          {
            ...abc7,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc7ToCollectionIfMissing(abc7Collection, abc7);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc7 to an array that doesn't contain it", () => {
        const abc7: IAbc7 = { id: 123 };
        const abc7Collection: IAbc7[] = [{ id: 456 }];
        expectedResult = service.addAbc7ToCollectionIfMissing(abc7Collection, abc7);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc7);
      });

      it('should add only unique Abc7 to an array', () => {
        const abc7Array: IAbc7[] = [{ id: 123 }, { id: 456 }, { id: 12084 }];
        const abc7Collection: IAbc7[] = [{ id: 123 }];
        expectedResult = service.addAbc7ToCollectionIfMissing(abc7Collection, ...abc7Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc7: IAbc7 = { id: 123 };
        const abc72: IAbc7 = { id: 456 };
        expectedResult = service.addAbc7ToCollectionIfMissing([], abc7, abc72);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc7);
        expect(expectedResult).toContain(abc72);
      });

      it('should accept null and undefined values', () => {
        const abc7: IAbc7 = { id: 123 };
        expectedResult = service.addAbc7ToCollectionIfMissing([], null, abc7, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc7);
      });

      it('should return initial array if no Abc7 is added', () => {
        const abc7Collection: IAbc7[] = [{ id: 123 }];
        expectedResult = service.addAbc7ToCollectionIfMissing(abc7Collection, undefined, null);
        expect(expectedResult).toEqual(abc7Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
