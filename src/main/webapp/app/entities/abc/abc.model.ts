import { IJoinTable } from 'app/entities/join-table/join-table.model';

export interface IAbc {
  id?: number;
  name?: string;
  xyzs?: IJoinTable[] | null;
}

export class Abc implements IAbc {
  constructor(public id?: number, public name?: string, public xyzs?: IJoinTable[] | null) {}
}

export function getAbcIdentifier(abc: IAbc): number | undefined {
  return abc.id;
}
