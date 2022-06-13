export interface IAbc7 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc7 implements IAbc7 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc7Identifier(abc7: IAbc7): number | undefined {
  return abc7.id;
}
