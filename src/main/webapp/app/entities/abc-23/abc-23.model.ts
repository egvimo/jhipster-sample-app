export interface IAbc23 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc23 implements IAbc23 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc23Identifier(abc23: IAbc23): number | undefined {
  return abc23.id;
}
