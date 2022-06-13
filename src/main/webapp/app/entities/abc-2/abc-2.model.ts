export interface IAbc2 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc2 implements IAbc2 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc2Identifier(abc2: IAbc2): number | undefined {
  return abc2.id;
}
