import { IJoinTableAbcXyz } from 'app/entities/join-table-abc-xyz/join-table-abc-xyz.model';

export interface IXyz {
  id?: number;
  name?: string;
  abcs?: IJoinTableAbcXyz[] | null;
}

export class Xyz implements IXyz {
  constructor(public id?: number, public name?: string, public abcs?: IJoinTableAbcXyz[] | null) {}
}

export function getXyzIdentifier(xyz: IXyz): number | undefined {
  return xyz.id;
}
