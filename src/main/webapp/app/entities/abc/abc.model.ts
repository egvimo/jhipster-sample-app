import { IXyz } from 'app/entities/xyz/xyz.model';

export interface IAbc {
  id?: number;
  name?: string;
  children?: IXyz[] | null;
}

export class Abc implements IAbc {
  constructor(public id?: number, public name?: string, public children?: IXyz[] | null) {}
}

export function getAbcIdentifier(abc: IAbc): number | undefined {
  return abc.id;
}
