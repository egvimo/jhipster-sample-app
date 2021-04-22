import { IJoinTable } from 'app/entities/join-table/join-table.model';

export interface IXyz {
  id?: number;
  name?: string;
  abcs?: IJoinTable[] | null;
}

export class Xyz implements IXyz {
  constructor(public id?: number, public name?: string, public abcs?: IJoinTable[] | null) {}
}

export function getXyzIdentifier(xyz: IXyz): number | undefined {
  return xyz.id;
}
