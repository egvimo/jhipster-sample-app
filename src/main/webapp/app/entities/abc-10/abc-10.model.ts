export interface IAbc10 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc10 implements IAbc10 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc10Identifier(abc10: IAbc10): number | undefined {
  return abc10.id;
}
