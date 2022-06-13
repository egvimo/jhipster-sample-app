import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc22, Abc22 } from '../abc-22.model';

import { Abc22Service } from './abc-22.service';

describe('Abc22 Service', () => {
  let service: Abc22Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc22;
  let expectedResult: IAbc22 | IAbc22[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc22Service);
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

    it('should create a Abc22', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc22()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc22', () => {
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

    it('should partial update a Abc22', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc22()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc22', () => {
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

    it('should delete a Abc22', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc22ToCollectionIfMissing', () => {
      it('should add a Abc22 to an empty array', () => {
        const abc22: IAbc22 = { id: 123 };
        expectedResult = service.addAbc22ToCollectionIfMissing([], abc22);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc22);
      });

      it('should not add a Abc22 to an array that contains it', () => {
        const abc22: IAbc22 = { id: 123 };
        const abc22Collection: IAbc22[] = [
          {
            ...abc22,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc22ToCollectionIfMissing(abc22Collection, abc22);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc22 to an array that doesn't contain it", () => {
        const abc22: IAbc22 = { id: 123 };
        const abc22Collection: IAbc22[] = [{ id: 456 }];
        expectedResult = service.addAbc22ToCollectionIfMissing(abc22Collection, abc22);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc22);
      });

      it('should add only unique Abc22 to an array', () => {
        const abc22Array: IAbc22[] = [{ id: 123 }, { id: 456 }, { id: 14686 }];
        const abc22Collection: IAbc22[] = [{ id: 123 }];
        expectedResult = service.addAbc22ToCollectionIfMissing(abc22Collection, ...abc22Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc22: IAbc22 = { id: 123 };
        const abc222: IAbc22 = { id: 456 };
        expectedResult = service.addAbc22ToCollectionIfMissing([], abc22, abc222);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc22);
        expect(expectedResult).toContain(abc222);
      });

      it('should accept null and undefined values', () => {
        const abc22: IAbc22 = { id: 123 };
        expectedResult = service.addAbc22ToCollectionIfMissing([], null, abc22, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc22);
      });

      it('should return initial array if no Abc22 is added', () => {
        const abc22Collection: IAbc22[] = [{ id: 123 }];
        expectedResult = service.addAbc22ToCollectionIfMissing(abc22Collection, undefined, null);
        expect(expectedResult).toEqual(abc22Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
