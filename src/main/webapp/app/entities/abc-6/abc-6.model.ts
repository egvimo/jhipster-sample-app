export interface IAbc6 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc6 implements IAbc6 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc6Identifier(abc6: IAbc6): number | undefined {
  return abc6.id;
}
