export interface IAbc28 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc28 implements IAbc28 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc28Identifier(abc28: IAbc28): number | undefined {
  return abc28.id;
}
