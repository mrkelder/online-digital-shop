export interface ChangeFiltersEventDetail {
  min: number;
  max: number;
  route: string;
  values: ReadonlyArray<CharacteristicQuery>;
}
