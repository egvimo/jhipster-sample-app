export interface IAbc29 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc29 implements IAbc29 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc29Identifier(abc29: IAbc29): number | undefined {
  return abc29.id;
}
