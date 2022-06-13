export interface IAbc16 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc16 implements IAbc16 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc16Identifier(abc16: IAbc16): number | undefined {
  return abc16.id;
}
