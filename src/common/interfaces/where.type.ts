import { Operator } from '../enums/operator.enum';

interface FieldOptions {
  is?: string;
  not?: string;
  in?: string;
  not_in?: string;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  contains?: string;
  not_contains?: string;
  starts_with?: string;
  not_starts_with?: string;
  ends_with?: string;
  not_ends_with?: string;
}

export interface Field {
  [key: string]: FieldOptions;
}

export type Where = {
  [K in Operator]?: (Where | Field)[];
};
