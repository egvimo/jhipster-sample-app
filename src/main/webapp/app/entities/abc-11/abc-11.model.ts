export interface IAbc11 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc11 implements IAbc11 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc11Identifier(abc11: IAbc11): number | undefined {
  return abc11.id;
}
