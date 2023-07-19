import { IAbc0, NewAbc0 } from './abc-0.model';

export const sampleWithRequiredData: IAbc0 = {
  id: 47840,
  name: 'Beauty',
};

export const sampleWithPartialData: IAbc0 = {
  id: 83712,
  name: 'Consultant circuit',
};

export const sampleWithFullData: IAbc0 = {
  id: 3283,
  name: 'Bedfordshire Web Creative',
  otherField: 'utilize',
};

export const sampleWithNewData: NewAbc0 = {
  name: 'open-source',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
