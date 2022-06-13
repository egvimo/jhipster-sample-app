export interface IAbc9 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc9 implements IAbc9 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc9Identifier(abc9: IAbc9): number | undefined {
  return abc9.id;
}
