import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc21, Abc21 } from '../abc-21.model';

import { Abc21Service } from './abc-21.service';

describe('Abc21 Service', () => {
  let service: Abc21Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc21;
  let expectedResult: IAbc21 | IAbc21[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc21Service);
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

    it('should create a Abc21', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc21()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc21', () => {
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

    it('should partial update a Abc21', () => {
      const patchObject = Object.assign({}, new Abc21());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc21', () => {
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

    it('should delete a Abc21', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc21ToCollectionIfMissing', () => {
      it('should add a Abc21 to an empty array', () => {
        const abc21: IAbc21 = { id: 123 };
        expectedResult = service.addAbc21ToCollectionIfMissing([], abc21);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc21);
      });

      it('should not add a Abc21 to an array that contains it', () => {
        const abc21: IAbc21 = { id: 123 };
        const abc21Collection: IAbc21[] = [
          {
            ...abc21,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc21ToCollectionIfMissing(abc21Collection, abc21);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc21 to an array that doesn't contain it", () => {
        const abc21: IAbc21 = { id: 123 };
        const abc21Collection: IAbc21[] = [{ id: 456 }];
        expectedResult = service.addAbc21ToCollectionIfMissing(abc21Collection, abc21);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc21);
      });

      it('should add only unique Abc21 to an array', () => {
        const abc21Array: IAbc21[] = [{ id: 123 }, { id: 456 }, { id: 71331 }];
        const abc21Collection: IAbc21[] = [{ id: 123 }];
        expectedResult = service.addAbc21ToCollectionIfMissing(abc21Collection, ...abc21Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc21: IAbc21 = { id: 123 };
        const abc212: IAbc21 = { id: 456 };
        expectedResult = service.addAbc21ToCollectionIfMissing([], abc21, abc212);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc21);
        expect(expectedResult).toContain(abc212);
      });

      it('should accept null and undefined values', () => {
        const abc21: IAbc21 = { id: 123 };
        expectedResult = service.addAbc21ToCollectionIfMissing([], null, abc21, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc21);
      });

      it('should return initial array if no Abc21 is added', () => {
        const abc21Collection: IAbc21[] = [{ id: 123 }];
        expectedResult = service.addAbc21ToCollectionIfMissing(abc21Collection, undefined, null);
        expect(expectedResult).toEqual(abc21Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
