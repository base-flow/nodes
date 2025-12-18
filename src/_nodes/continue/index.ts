import type { INodeConfig } from "@baseflow/react";
import { getLocale, NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Break,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
