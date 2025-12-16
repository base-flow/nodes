import type { INodeConfig } from "@baseflow/react";
import { FlowErrors, getLocale, NodeType } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Return,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"],
  NodeInputPanel,
  backend: {},
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"],
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
