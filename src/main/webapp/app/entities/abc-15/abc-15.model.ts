export interface IAbc15 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc15 implements IAbc15 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc15Identifier(abc15: IAbc15): number | undefined {
  return abc15.id;
}
