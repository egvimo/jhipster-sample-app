export interface IAbc25 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc25 implements IAbc25 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc25Identifier(abc25: IAbc25): number | undefined {
  return abc25.id;
}
