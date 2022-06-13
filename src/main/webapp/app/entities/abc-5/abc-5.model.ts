export interface IAbc5 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc5 implements IAbc5 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc5Identifier(abc5: IAbc5): number | undefined {
  return abc5.id;
}
