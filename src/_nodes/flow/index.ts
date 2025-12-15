import type { INodeConfig } from "@baseflow/react";
import { NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Flow,
  icon: "",
  desc: "流程：定义一个独立的流程",
  backend: {},
  defaultData() {
    return {
      meta: {
        name: "流程",
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
