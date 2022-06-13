import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAbc25, Abc25 } from '../abc-25.model';

import { Abc25Service } from './abc-25.service';

describe('Abc25 Service', () => {
  let service: Abc25Service;
  let httpMock: HttpTestingController;
  let elemDefault: IAbc25;
  let expectedResult: IAbc25 | IAbc25[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Abc25Service);
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

    it('should create a Abc25', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Abc25()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Abc25', () => {
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

    it('should partial update a Abc25', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          otherField: 'BBBBBB',
        },
        new Abc25()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Abc25', () => {
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

    it('should delete a Abc25', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAbc25ToCollectionIfMissing', () => {
      it('should add a Abc25 to an empty array', () => {
        const abc25: IAbc25 = { id: 123 };
        expectedResult = service.addAbc25ToCollectionIfMissing([], abc25);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc25);
      });

      it('should not add a Abc25 to an array that contains it', () => {
        const abc25: IAbc25 = { id: 123 };
        const abc25Collection: IAbc25[] = [
          {
            ...abc25,
          },
          { id: 456 },
        ];
        expectedResult = service.addAbc25ToCollectionIfMissing(abc25Collection, abc25);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Abc25 to an array that doesn't contain it", () => {
        const abc25: IAbc25 = { id: 123 };
        const abc25Collection: IAbc25[] = [{ id: 456 }];
        expectedResult = service.addAbc25ToCollectionIfMissing(abc25Collection, abc25);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc25);
      });

      it('should add only unique Abc25 to an array', () => {
        const abc25Array: IAbc25[] = [{ id: 123 }, { id: 456 }, { id: 43893 }];
        const abc25Collection: IAbc25[] = [{ id: 123 }];
        expectedResult = service.addAbc25ToCollectionIfMissing(abc25Collection, ...abc25Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const abc25: IAbc25 = { id: 123 };
        const abc252: IAbc25 = { id: 456 };
        expectedResult = service.addAbc25ToCollectionIfMissing([], abc25, abc252);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(abc25);
        expect(expectedResult).toContain(abc252);
      });

      it('should accept null and undefined values', () => {
        const abc25: IAbc25 = { id: 123 };
        expectedResult = service.addAbc25ToCollectionIfMissing([], null, abc25, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(abc25);
      });

      it('should return initial array if no Abc25 is added', () => {
        const abc25Collection: IAbc25[] = [{ id: 123 }];
        expectedResult = service.addAbc25ToCollectionIfMissing(abc25Collection, undefined, null);
        expect(expectedResult).toEqual(abc25Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
