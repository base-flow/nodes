import type { INodeConfig } from "@baseflow/react";
import { NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Branch,
  icon: "",
  desc: "条件分支：放置于[条件选择]中，通过设置执行条件来决定是否执行",
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: "条件分支",
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
