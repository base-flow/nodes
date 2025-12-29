import type { IDataType } from "@baseflow/react";
import type { ConditionItem, Conditions, Relation } from "../../model";

export const AndOrOptions = ["AND", "OR"];

export interface _ConditionItem extends ConditionItem {
  key?: number;
  operatorOptions?: { label: string; value: string }[];
}

export interface _Conditions {
  relation: Relation;
  groups: Array<{
    key?: number;
    relation: Relation;
    items: _ConditionItem[];
  }>;
}

export function DefaultOnValueChange(value?: Conditions) {}

export function getOperatorOptions(sourceType: IDataType): { label: string; value: string }[] {
  return [];
}
