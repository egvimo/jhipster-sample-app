export interface IAbc8 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc8 implements IAbc8 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc8Identifier(abc8: IAbc8): number | undefined {
  return abc8.id;
}
