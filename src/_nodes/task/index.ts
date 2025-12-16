import type { INodeConfig } from "@baseflow/react";
import { DataType, getLocale, NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Task,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"],
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"],
        width: 250,
        height: 68,
        outputSchema: { name: "output", type: DataType.Bool },
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    if (!nodeData.props.input) {
      return "Task input is required!";
    }
  },
};

export default config;
