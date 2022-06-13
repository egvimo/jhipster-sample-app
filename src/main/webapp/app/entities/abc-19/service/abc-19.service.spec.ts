import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc19, Abc19 } from '../abc-19.model';

import { Abc19Service } from './abc-19.service';

describe('Abc19 Service', () => {
  let service: Abc19Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc19;
  let expectedResult: IAbc19 | IAbc19[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc19Service);
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

    it('should create a Abc19', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc19()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc19', () => {
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

    it('should partial update a Abc19', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Abc19()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc19', () => {
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

    it('should delete a Abc19', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc19ToCollectionIfMissing', () => {
      it('should add a Abc19 to an empty array', () => {
        const abc19: IAbc19 = { id: 123 };
        expectedResult = service.addAbc19ToCollectionIfMissing([], abc19);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc19);
      });

      it('should not add a Abc19 to an array that contains it', () => {
        const abc19: IAbc19 = { id: 123 };
        const abc19Collection: IAbc19[] = [
          {
            ...abc19,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc19ToCollectionIfMissing(abc19Collection, abc19);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc19 to an array that doesn't contain it", () => {
        const abc19: IAbc19 = { id: 123 };
        const abc19Collection: IAbc19[] = [{ id: 456 }];
        expectedResult = service.addAbc19ToCollectionIfMissing(abc19Collection, abc19);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc19);
      });

      it('should add only unique Abc19 to an array', () => {
        const abc19Array: IAbc19[] = [{ id: 123 }, { id: 456 }, { id: 78916 }];
        const abc19Collection: IAbc19[] = [{ id: 123 }];
        expectedResult = service.addAbc19ToCollectionIfMissing(abc19Collection, ...abc19Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc19: IAbc19 = { id: 123 };
        const abc192: IAbc19 = { id: 456 };
        expectedResult = service.addAbc19ToCollectionIfMissing([], abc19, abc192);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc19);
        expect(expectedResult).toContain(abc192);
      });

      it('should accept null and undefined values', () => {
        const abc19: IAbc19 = { id: 123 };
        expectedResult = service.addAbc19ToCollectionIfMissing([], null, abc19, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc19);
      });

      it('should return initial array if no Abc19 is added', () => {
        const abc19Collection: IAbc19[] = [{ id: 123 }];
        expectedResult = service.addAbc19ToCollectionIfMissing(abc19Collection, undefined, null);
        expect(expectedResult).toEqual(abc19Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
