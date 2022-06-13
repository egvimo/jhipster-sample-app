import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc15, Abc15 } from '../abc-15.model';

import { Abc15Service } from './abc-15.service';

describe('Abc15 Service', () => {
  let service: Abc15Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc15;
  let expectedResult: IAbc15 | IAbc15[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc15Service);
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

    it('should create a Abc15', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc15()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc15', () => {
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

    it('should partial update a Abc15', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Abc15()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc15', () => {
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

    it('should delete a Abc15', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc15ToCollectionIfMissing', () => {
      it('should add a Abc15 to an empty array', () => {
        const abc15: IAbc15 = { id: 123 };
        expectedResult = service.addAbc15ToCollectionIfMissing([], abc15);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc15);
      });

      it('should not add a Abc15 to an array that contains it', () => {
        const abc15: IAbc15 = { id: 123 };
        const abc15Collection: IAbc15[] = [
          {
            ...abc15,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc15ToCollectionIfMissing(abc15Collection, abc15);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc15 to an array that doesn't contain it", () => {
        const abc15: IAbc15 = { id: 123 };
        const abc15Collection: IAbc15[] = [{ id: 456 }];
        expectedResult = service.addAbc15ToCollectionIfMissing(abc15Collection, abc15);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc15);
      });

      it('should add only unique Abc15 to an array', () => {
        const abc15Array: IAbc15[] = [{ id: 123 }, { id: 456 }, { id: 50111 }];
        const abc15Collection: IAbc15[] = [{ id: 123 }];
        expectedResult = service.addAbc15ToCollectionIfMissing(abc15Collection, ...abc15Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc15: IAbc15 = { id: 123 };
        const abc152: IAbc15 = { id: 456 };
        expectedResult = service.addAbc15ToCollectionIfMissing([], abc15, abc152);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc15);
        expect(expectedResult).toContain(abc152);
      });

      it('should accept null and undefined values', () => {
        const abc15: IAbc15 = { id: 123 };
        expectedResult = service.addAbc15ToCollectionIfMissing([], null, abc15, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc15);
      });

      it('should return initial array if no Abc15 is added', () => {
        const abc15Collection: IAbc15[] = [{ id: 123 }];
        expectedResult = service.addAbc15ToCollectionIfMissing(abc15Collection, undefined, null);
        expect(expectedResult).toEqual(abc15Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
