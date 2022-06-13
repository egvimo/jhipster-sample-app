export interface IAbc0 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc0 implements IAbc0 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc0Identifier(abc0: IAbc0): number | undefined {
  return abc0.id;
}
