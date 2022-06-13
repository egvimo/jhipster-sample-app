export interface IAbc20 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc20 implements IAbc20 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc20Identifier(abc20: IAbc20): number | undefined {
  return abc20.id;
}
