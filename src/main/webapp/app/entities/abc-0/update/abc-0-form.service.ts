import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAbc0, NewAbc0 } from '../abc-0.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAbc0 for edit and NewAbc0FormGroupInput for create.
 */
type Abc0FormGroupInput = IAbc0 | PartialWithRequiredKeyOf<NewAbc0>;

type Abc0FormDefaults = Pick<NewAbc0, 'id'>;

type Abc0FormGroupContent = {
  id: FormControl<IAbc0['id'] | NewAbc0['id']>;
  name: FormControl<IAbc0['name']>;
  otherField: FormControl<IAbc0['otherField']>;
};

export type Abc0FormGroup = FormGroup<Abc0FormGroupContent>;

@Injectable({ providedIn: 'root' })
export class Abc0FormService {
  createAbc0FormGroup(abc0: Abc0FormGroupInput = { id: null }): Abc0FormGroup {
    const abc0RawValue = {
      ...this.getFormDefaults(),
      ...abc0,
    };
    return new FormGroup<Abc0FormGroupContent>({
      id: new FormControl(
        { value: abc0RawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(abc0RawValue.name, {
        validators: [Validators.required],
      }),
      otherField: new FormControl(abc0RawValue.otherField),
    });
  }

  getAbc0(form: Abc0FormGroup): IAbc0 | NewAbc0 {
    return form.getRawValue() as IAbc0 | NewAbc0;
  }

  resetForm(form: Abc0FormGroup, abc0: Abc0FormGroupInput): void {
    const abc0RawValue = { ...this.getFormDefaults(), ...abc0 };
    form.reset(
      {
        ...abc0RawValue,
        id: { value: abc0RawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): Abc0FormDefaults {
    return {
      id: null,
    };
  }
}
