import type { INodeInputPanel } from "@baseflow/react";
import { useGraph, useNode } from "@baseflow/react";
import { memo, useState } from "react";
import type { Conditions, NodeProps } from "../model";
import ConditionSelector from "./ConditionSelector";

const Component: INodeInputPanel<NodeProps> = ({ nodeData }) => {
  "use no memo";
  const { graph } = useGraph();
  const { node } = useNode(nodeData.id);
  const [conditions, setConditions] = useState<Conditions>();

  return (
    <div>
      <ConditionSelector value={conditions} onChange={setConditions} />
    </div>
  );
};
export default memo(Component);
