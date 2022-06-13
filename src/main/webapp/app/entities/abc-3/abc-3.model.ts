export interface IAbc3 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc3 implements IAbc3 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc3Identifier(abc3: IAbc3): number | undefined {
  return abc3.id;
}
