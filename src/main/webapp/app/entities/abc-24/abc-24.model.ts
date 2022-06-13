export interface IAbc24 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc24 implements IAbc24 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc24Identifier(abc24: IAbc24): number | undefined {
  return abc24.id;
}
