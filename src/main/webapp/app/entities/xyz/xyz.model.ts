export interface IXyz {
  id?: number;
  uniqueField?: string;
  anotherField?: string | null;
}

export class Xyz implements IXyz {
  constructor(public id?: number, public uniqueField?: string, public anotherField?: string | null) {}
}

export function getXyzIdentifier(xyz: IXyz): number | undefined {
  return xyz.id;
}
