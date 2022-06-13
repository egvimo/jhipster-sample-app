export interface IAbc17 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc17 implements IAbc17 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc17Identifier(abc17: IAbc17): number | undefined {
  return abc17.id;
}
