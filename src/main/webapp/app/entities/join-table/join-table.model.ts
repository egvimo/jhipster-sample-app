import { IAbc } from 'app/entities/abc/abc.model';
import { IXyz } from 'app/entities/xyz/xyz.model';

export interface IJoinTable {
  id?: number;
  additionalColumn?: string;
  abc?: IAbc;
  xyz?: IXyz;
}

export class JoinTable implements IJoinTable {
  constructor(public id?: number, public additionalColumn?: string, public abc?: IAbc, public xyz?: IXyz) {}
}

export function getJoinTableIdentifier(joinTable: IJoinTable): number | undefined {
  return joinTable.id;
}
