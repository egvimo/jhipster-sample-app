export interface IAbc12 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc12 implements IAbc12 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc12Identifier(abc12: IAbc12): number | undefined {
  return abc12.id;
}
