import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc20, Abc20 } from '../abc-20.model';

import { Abc20Service } from './abc-20.service';

describe('Abc20 Service', () => {
  let service: Abc20Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc20;
  let expectedResult: IAbc20 | IAbc20[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc20Service);
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

    it('should create a Abc20', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc20()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc20', () => {
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

    it('should partial update a Abc20', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc20()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc20', () => {
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

    it('should delete a Abc20', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc20ToCollectionIfMissing', () => {
      it('should add a Abc20 to an empty array', () => {
        const abc20: IAbc20 = { id: 123 };
        expectedResult = service.addAbc20ToCollectionIfMissing([], abc20);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc20);
      });

      it('should not add a Abc20 to an array that contains it', () => {
        const abc20: IAbc20 = { id: 123 };
        const abc20Collection: IAbc20[] = [
          {
            ...abc20,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc20ToCollectionIfMissing(abc20Collection, abc20);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc20 to an array that doesn't contain it", () => {
        const abc20: IAbc20 = { id: 123 };
        const abc20Collection: IAbc20[] = [{ id: 456 }];
        expectedResult = service.addAbc20ToCollectionIfMissing(abc20Collection, abc20);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc20);
      });

      it('should add only unique Abc20 to an array', () => {
        const abc20Array: IAbc20[] = [{ id: 123 }, { id: 456 }, { id: 5238 }];
        const abc20Collection: IAbc20[] = [{ id: 123 }];
        expectedResult = service.addAbc20ToCollectionIfMissing(abc20Collection, ...abc20Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc20: IAbc20 = { id: 123 };
        const abc202: IAbc20 = { id: 456 };
        expectedResult = service.addAbc20ToCollectionIfMissing([], abc20, abc202);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc20);
        expect(expectedResult).toContain(abc202);
      });

      it('should accept null and undefined values', () => {
        const abc20: IAbc20 = { id: 123 };
        expectedResult = service.addAbc20ToCollectionIfMissing([], null, abc20, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc20);
      });

      it('should return initial array if no Abc20 is added', () => {
        const abc20Collection: IAbc20[] = [{ id: 123 }];
        expectedResult = service.addAbc20ToCollectionIfMissing(abc20Collection, undefined, null);
        expect(expectedResult).toEqual(abc20Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
