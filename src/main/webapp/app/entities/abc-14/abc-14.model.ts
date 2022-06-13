export interface IAbc14 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc14 implements IAbc14 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc14Identifier(abc14: IAbc14): number | undefined {
  return abc14.id;
}
