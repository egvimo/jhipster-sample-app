import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../abc-0.test-samples';

import { Abc0FormService } from './abc-0-form.service';

describe('Abc0 Form Service', () => {
  let service: Abc0FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Abc0FormService);
  });

  describe('Service methods', () => {
    describe('createAbc0FormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAbc0FormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            otherField: expect.any(Object),
          })
        );
      });

      it('passing IAbc0 should create a new form with FormGroup', () => {
        const formGroup = service.createAbc0FormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            otherField: expect.any(Object),
          })
        );
      });
    });

    describe('getAbc0', () => {
      it('should return NewAbc0 for default Abc0 initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAbc0FormGroup(sampleWithNewData);

        const abc0 = service.getAbc0(formGroup) as any;

        expect(abc0).toMatchObject(sampleWithNewData);
      });

      it('should return NewAbc0 for empty Abc0 initial value', () => {
        const formGroup = service.createAbc0FormGroup();

        const abc0 = service.getAbc0(formGroup) as any;

        expect(abc0).toMatchObject({});
      });

      it('should return IAbc0', () => {
        const formGroup = service.createAbc0FormGroup(sampleWithRequiredData);

        const abc0 = service.getAbc0(formGroup) as any;

        expect(abc0).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAbc0 should not enable id FormControl', () => {
        const formGroup = service.createAbc0FormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAbc0 should disable id FormControl', () => {
        const formGroup = service.createAbc0FormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
