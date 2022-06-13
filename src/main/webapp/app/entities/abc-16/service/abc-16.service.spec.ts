import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc16, Abc16 } from '../abc-16.model';

import { Abc16Service } from './abc-16.service';

describe('Abc16 Service', () => {
  let service: Abc16Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc16;
  let expectedResult: IAbc16 | IAbc16[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc16Service);
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

    it('should create a Abc16', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc16()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc16', () => {
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

    it('should partial update a Abc16', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc16()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc16', () => {
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

    it('should delete a Abc16', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc16ToCollectionIfMissing', () => {
      it('should add a Abc16 to an empty array', () => {
        const abc16: IAbc16 = { id: 123 };
        expectedResult = service.addAbc16ToCollectionIfMissing([], abc16);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc16);
      });

      it('should not add a Abc16 to an array that contains it', () => {
        const abc16: IAbc16 = { id: 123 };
        const abc16Collection: IAbc16[] = [
          {
            ...abc16,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc16ToCollectionIfMissing(abc16Collection, abc16);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc16 to an array that doesn't contain it", () => {
        const abc16: IAbc16 = { id: 123 };
        const abc16Collection: IAbc16[] = [{ id: 456 }];
        expectedResult = service.addAbc16ToCollectionIfMissing(abc16Collection, abc16);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc16);
      });

      it('should add only unique Abc16 to an array', () => {
        const abc16Array: IAbc16[] = [{ id: 123 }, { id: 456 }, { id: 81698 }];
        const abc16Collection: IAbc16[] = [{ id: 123 }];
        expectedResult = service.addAbc16ToCollectionIfMissing(abc16Collection, ...abc16Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc16: IAbc16 = { id: 123 };
        const abc162: IAbc16 = { id: 456 };
        expectedResult = service.addAbc16ToCollectionIfMissing([], abc16, abc162);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc16);
        expect(expectedResult).toContain(abc162);
      });

      it('should accept null and undefined values', () => {
        const abc16: IAbc16 = { id: 123 };
        expectedResult = service.addAbc16ToCollectionIfMissing([], null, abc16, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc16);
      });

      it('should return initial array if no Abc16 is added', () => {
        const abc16Collection: IAbc16[] = [{ id: 123 }];
        expectedResult = service.addAbc16ToCollectionIfMissing(abc16Collection, undefined, null);
        expect(expectedResult).toEqual(abc16Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
