import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJoinTable, JoinTable } from '../join-table.model';

import { JoinTableService } from './join-table.service';

describe('Service Tests', () => {
  describe('JoinTable Service', () => {
    let service: JoinTableService;
    let httpMock: HttpTestingController;
    let elemDefault: IJoinTable;
    let expectedResult: IJoinTable | IJoinTable[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(JoinTableService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        additionalColumn: 'AAAAAAA',
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

      it('should create a JoinTable', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new JoinTable()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a JoinTable', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            additionalColumn: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a JoinTable', () => {
        const patchObject = Object.assign(
          {
            additionalColumn: 'BBBBBB',
          },
          new JoinTable()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of JoinTable', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            additionalColumn: 'BBBBBB',
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

      it('should delete a JoinTable', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addJoinTableToCollectionIfMissing', () => {
        it('should add a JoinTable to an empty array', () => {
          const joinTable: IJoinTable = { id: 123 };
          expectedResult = service.addJoinTableToCollectionIfMissing([], joinTable);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(joinTable);
        });

        it('should not add a JoinTable to an array that contains it', () => {
          const joinTable: IJoinTable = { id: 123 };
          const joinTableCollection: IJoinTable[] = [
            {
              ...joinTable,
            },
            { id: 456 },
          ];
          expectedResult = service.addJoinTableToCollectionIfMissing(joinTableCollection, joinTable);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a JoinTable to an array that doesn't contain it", () => {
          const joinTable: IJoinTable = { id: 123 };
          const joinTableCollection: IJoinTable[] = [{ id: 456 }];
          expectedResult = service.addJoinTableToCollectionIfMissing(joinTableCollection, joinTable);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(joinTable);
        });

        it('should add only unique JoinTable to an array', () => {
          const joinTableArray: IJoinTable[] = [{ id: 123 }, { id: 456 }, { id: 51898 }];
          const joinTableCollection: IJoinTable[] = [{ id: 123 }];
          expectedResult = service.addJoinTableToCollectionIfMissing(joinTableCollection, ...joinTableArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const joinTable: IJoinTable = { id: 123 };
          const joinTable2: IJoinTable = { id: 456 };
          expectedResult = service.addJoinTableToCollectionIfMissing([], joinTable, joinTable2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(joinTable);
          expect(expectedResult).toContain(joinTable2);
        });

        it('should accept null and undefined values', () => {
          const joinTable: IJoinTable = { id: 123 };
          expectedResult = service.addJoinTableToCollectionIfMissing([], null, joinTable, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(joinTable);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
