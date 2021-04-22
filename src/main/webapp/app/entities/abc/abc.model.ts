import { IJoinTableAbcXyz } from 'app/entities/join-table-abc-xyz/join-table-abc-xyz.model';

export interface IAbc {
  id?: number;
  name?: string;
  xyzs?: IJoinTableAbcXyz[] | null;
}

export class Abc implements IAbc {
  constructor(public id?: number, public name?: string, public xyzs?: IJoinTableAbcXyz[] | null) {}
}

export function getAbcIdentifier(abc: IAbc): number | undefined {
  return abc.id;
}
