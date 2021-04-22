import { IAbc } from 'app/entities/abc/abc.model';
import { IXyz } from 'app/entities/xyz/xyz.model';

export interface IJoinTableAbcXyz {
  id?: number;
  additionalColumn?: string;
  abc?: IAbc;
  xyz?: IXyz;
}

export class JoinTableAbcXyz implements IJoinTableAbcXyz {
  constructor(public id?: number, public additionalColumn?: string, public abc?: IAbc, public xyz?: IXyz) {}
}

export function getJoinTableAbcXyzIdentifier(joinTableAbcXyz: IJoinTableAbcXyz): number | undefined {
  return joinTableAbcXyz.id;
}
