import type { INodeConfig } from "@baseflow/react";
import { NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Choice,
  icon: "",
  desc: "条件选择：可添加多个[条件分支]，通过条件判断来控制分支执行",
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: "条件选择",
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
