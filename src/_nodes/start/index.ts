import type { INodeConfig } from "@baseflow/react";
import { getLocale, NodeType } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Start,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"],
  NodeInputPanel,
  backend: {
    node: "",
  },
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"],
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
