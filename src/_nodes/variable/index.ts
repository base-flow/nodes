import type { INodeConfig } from "@baseflow/react";
import { DataType, getLocale, NodeType } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Variable,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  NodeInputPanel,
  backend: {},
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        width: 250,
        height: 68,
        outputSchema: { name: "output", type: DataType.Object, children: [{ name: "new", type: DataType.String }] },
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
