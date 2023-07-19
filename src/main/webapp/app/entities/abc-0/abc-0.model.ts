export interface IAbc0 {
  id: number;
  name?: string | null;
  otherField?: string | null;
}

export type NewAbc0 = Omit<IAbc0, 'id'> & { id: null };
