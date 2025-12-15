import type { INodeConfig } from "@baseflow/react";
import { NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Group,
  icon: "",
  desc: "TryCatch：提供一个可以捕获子节点运行时错误的容器节点",
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: "TryCatch",
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
