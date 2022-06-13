export interface IAbc13 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc13 implements IAbc13 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc13Identifier(abc13: IAbc13): number | undefined {
  return abc13.id;
}
