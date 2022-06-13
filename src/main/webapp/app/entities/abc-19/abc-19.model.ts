export interface IAbc19 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc19 implements IAbc19 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc19Identifier(abc19: IAbc19): number | undefined {
  return abc19.id;
}
