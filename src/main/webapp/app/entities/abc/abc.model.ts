export interface IAbc {
  id?: number;
  name?: string;
  myFieldWithValidation?: string | null;
}

export class Abc implements IAbc {
  constructor(public id?: number, public name?: string, public myFieldWithValidation?: string | null) {}
}

export function getAbcIdentifier(abc: IAbc): number | undefined {
  return abc.id;
}
