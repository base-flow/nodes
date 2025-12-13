import type { INodeConfig } from "@baseflow/react";
import { NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Break,
  icon: "",
  desc: "Break循环：放置于[循环]节点中，退出整个循环",
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: "Break循环",
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
