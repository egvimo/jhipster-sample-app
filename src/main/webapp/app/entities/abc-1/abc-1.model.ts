export interface IAbc1 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc1 implements IAbc1 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc1Identifier(abc1: IAbc1): number | undefined {
  return abc1.id;
}
