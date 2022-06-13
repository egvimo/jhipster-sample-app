export interface IAbc22 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc22 implements IAbc22 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc22Identifier(abc22: IAbc22): number | undefined {
  return abc22.id;
}
