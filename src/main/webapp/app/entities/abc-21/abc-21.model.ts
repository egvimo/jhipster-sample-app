export interface IAbc21 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc21 implements IAbc21 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc21Identifier(abc21: IAbc21): number | undefined {
  return abc21.id;
}
