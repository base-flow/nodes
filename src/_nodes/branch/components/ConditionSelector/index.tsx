"use no memo";
import { BaseWidgets, DataType, SuperInput, useEvent, type ValueConfig, ValueSource } from "@baseflow/react";
import { Radio } from "antd";
import type { FC } from "react";
import { memo, useMemo, useRef } from "react";
import type { Conditions } from "../../model";
import { type _Conditions, AndOrOptions, DefaultOnValueChange, getOperatorOptions } from "./base";
import "./index.scss";

const DefaultInputValue: ValueConfig = { type: DataType.String, source: ValueSource.Variable, text: "" };

export interface ConditionSelectorProps {
  value?: Conditions;
  onChange?: (value?: Conditions) => void;
}

const Component: FC<ConditionSelectorProps> = ({ value, onChange = DefaultOnValueChange }) => {
  const uid = useRef(0);
  const uidMap = useRef(new Map<any, number>());
  const internalData = useRef<{ value?: Conditions; _value?: _Conditions }>({ value: undefined, _value: undefined });

  useMemo(() => {
    if (value !== internalData.current.value) {
      internalData.current.value = value;
      if (value) {
        const _value: _Conditions = JSON.parse(JSON.stringify(value));
        internalData.current._value = _value;
        _value.groups.forEach((group) => {
          group.items.forEach((item) => {
            if (!item.operatorOptions) {
              item.operatorOptions = getOperatorOptions(item.source.type);
            }
          });
        });
      } else {
        internalData.current._value = undefined;
      }
    }
  }, [value]);

  const _value = internalData.current._value;

  const _onChange = useEvent((_NewValue?: _Conditions) => {
    if (_NewValue) {
      const newValue: Conditions = {
        ..._NewValue,
        groups: _NewValue.groups.map(({ relation, items }) => ({
          relation,
          items: items.map(({ source, target, operator }) => ({
            source,
            target,
            operator,
          })),
        })),
      };
      onChange(newValue);
    } else {
      onChange(undefined);
    }
  });

  const onGroupRelationChange = useEvent((e: any) => {
    _onChange({ ..._value!, relation: e.target.value });
  });

  const onCreate = useEvent(() => {
    _onChange({ relation: "or", groups: [{ relation: "and", items: [{ source: { ...DefaultInputValue }, operator: "", target: { ...DefaultInputValue } }] }] });
  });

  const onGroupAdd = useEvent(() => {
    _onChange({ ..._value!, groups: [..._value!.groups, { relation: "and", items: [{ source: { ...DefaultInputValue }, operator: "", target: { ...DefaultInputValue } }] }] });
  });

  const onGroupDel = useEvent((groupIndex: number) => {
    const groups = _value!.groups.filter((group, index) => {
      if (groupIndex === index) {
        uidMap.current.delete(group);
        return false;
      } else {
        return true;
      }
    });
    _onChange(!groups.length ? undefined : { ..._value!, groups });
  });

  if (!_value) {
    return (
      <div className="ͼbaseflow-ConditionSelector">
        <BaseWidgets.Button onClick={onCreate}>增加条件</BaseWidgets.Button>
      </div>
    );
  }
  return (
    <div className="ͼbaseflow-ConditionSelector">
      {_value.groups.map((group, groupIndex) => {
        if (!group.key) {
          group.key = uid.current++;
        }
        return (
          <div key={group.key} className="group">
            {groupIndex !== 0 && (
              <div className="group-relation">
                <Radio.Group size="small" options={AndOrOptions} value={_value.relation} onChange={onGroupRelationChange} />
              </div>
            )}
            <div className="group-panel">
              <div className="actions">-删除</div>
              {group.items.map((item, itemIndex) => {
                if (!item.key) {
                  item.key = uid.current++;
                }
                return (
                  <div key={item.key} className="condition-item">
                    <div>{itemIndex === 0 ? "当" : group.relation}</div>
                    <SuperInput />
                    <SuperInput />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Component);
