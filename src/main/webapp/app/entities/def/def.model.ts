import { IXyz } from 'app/entities/xyz/xyz.model';

export interface IDef {
  id?: number;
  name?: string | null;
  xyz?: IXyz | null;
}

export class Def implements IDef {
  constructor(public id?: number, public name?: string | null, public xyz?: IXyz | null) {}
}

export function getDefIdentifier(def: IDef): number | undefined {
  return def.id;
}
