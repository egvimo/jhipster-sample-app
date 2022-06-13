export interface IAbc27 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc27 implements IAbc27 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc27Identifier(abc27: IAbc27): number | undefined {
  return abc27.id;
}
