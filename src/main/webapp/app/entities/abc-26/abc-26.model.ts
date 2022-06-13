export interface IAbc26 {
  id?: number;
  name?: string;
  otherField?: string | null;
}

export class Abc26 implements IAbc26 {
  constructor(public id?: number, public name?: string, public otherField?: string | null) {}
}

export function getAbc26Identifier(abc26: IAbc26): number | undefined {
  return abc26.id;
}
