export interface IAbc4 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc4 implements IAbc4 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc4Identifier(abc4: IAbc4): number | undefined {
  return abc4.id;
}
