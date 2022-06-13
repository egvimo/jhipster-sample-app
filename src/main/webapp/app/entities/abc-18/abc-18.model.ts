export interface IAbc18 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc18 implements IAbc18 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc18Identifier(abc18: IAbc18): number | undefined {
  return abc18.id;
}
