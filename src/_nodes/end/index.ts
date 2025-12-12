import type { INodeConfig } from "@baseflow/react";
import { FlowErrors, NodeType } from "@baseflow/react";
//import NodeInputPanel from "./components/NodeInputPanel";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.End,
  icon: "",
  desc: "流程结束：流程正常执行完成，可以设置返回数据",
  // NodeInputPanel,
  backend: {},
  defaultData() {
    return {
      meta: {
        name: "结束",
        width: 250,
        height: 68,
        valueReference: { path: "flow" },
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    if (nodeData.meta.configurationErrors === FlowErrors.returnSchemaChanged) {
      return FlowErrors.returnSchemaChanged;
    }
  },
};

export default config;
