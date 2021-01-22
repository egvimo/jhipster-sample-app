export interface IAbc {
  id?: number;
  name?: string;
  parent?: IAbc | null;
  children?: IAbc[] | null;
}

export class Abc implements IAbc {
  constructor(public id?: number, public name?: string, public parent?: IAbc | null, public children?: IAbc[] | null) {}
}
