import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc29, Abc29 } from '../abc-29.model';

import { Abc29Service } from './abc-29.service';

describe('Abc29 Service', () => {
  let service: Abc29Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc29;
  let expectedResult: IAbc29 | IAbc29[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc29Service);
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

    it('should create a Abc29', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc29()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc29', () => {
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

    it('should partial update a Abc29', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Abc29()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc29', () => {
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

    it('should delete a Abc29', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc29ToCollectionIfMissing', () => {
      it('should add a Abc29 to an empty array', () => {
        const abc29: IAbc29 = { id: 123 };
        expectedResult = service.addAbc29ToCollectionIfMissing([], abc29);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc29);
      });

      it('should not add a Abc29 to an array that contains it', () => {
        const abc29: IAbc29 = { id: 123 };
        const abc29Collection: IAbc29[] = [
          {
            ...abc29,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc29ToCollectionIfMissing(abc29Collection, abc29);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc29 to an array that doesn't contain it", () => {
        const abc29: IAbc29 = { id: 123 };
        const abc29Collection: IAbc29[] = [{ id: 456 }];
        expectedResult = service.addAbc29ToCollectionIfMissing(abc29Collection, abc29);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc29);
      });

      it('should add only unique Abc29 to an array', () => {
        const abc29Array: IAbc29[] = [{ id: 123 }, { id: 456 }, { id: 48708 }];
        const abc29Collection: IAbc29[] = [{ id: 123 }];
        expectedResult = service.addAbc29ToCollectionIfMissing(abc29Collection, ...abc29Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc29: IAbc29 = { id: 123 };
        const abc292: IAbc29 = { id: 456 };
        expectedResult = service.addAbc29ToCollectionIfMissing([], abc29, abc292);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc29);
        expect(expectedResult).toContain(abc292);
      });

      it('should accept null and undefined values', () => {
        const abc29: IAbc29 = { id: 123 };
        expectedResult = service.addAbc29ToCollectionIfMissing([], null, abc29, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc29);
      });

      it('should return initial array if no Abc29 is added', () => {
        const abc29Collection: IAbc29[] = [{ id: 123 }];
        expectedResult = service.addAbc29ToCollectionIfMissing(abc29Collection, undefined, null);
        expect(expectedResult).toEqual(abc29Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
