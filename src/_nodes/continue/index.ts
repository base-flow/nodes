import type { INodeConfig } from "@baseflow/react";
import { NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Break,
  icon: "",
  desc: "Continue循环：放置于[循环]节点中，跳过本次循环，继续下一次循环",
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: "Continue循环",
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
