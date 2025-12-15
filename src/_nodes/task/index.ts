import type { INodeConfig } from "@baseflow/react";
import { DataType, NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Task,
  icon: "",
  desc: "Task任务",
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: "Task任务",
        width: 250,
        height: 68,
        outputSchema: { name: "output", type: DataType.Bool },
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    if (!nodeData.props.input) {
      return "Task input is required!";
    }
  },
};

export default config;
