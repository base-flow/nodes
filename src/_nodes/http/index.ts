import type { INodeConfig } from "@baseflow/react";
import { getLocale, NodeType } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { NodeProps } from "./model";
import PKG from "./package.json";
import UserManual from "./UserManual";

const META = PKG.baseflow as { [key: string]: string };
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Task,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"],
  NodeInputPanel,
  NodeOutputPanel: {
    editable: true,
    toolsFilter: (item, parent) => {
      if (!parent) {
        return { addNext: false, addChild: false, edit: false, delete: false };
      }
      if (parent.name === "response") {
        return { addNext: false, addChild: true, edit: false, delete: false };
      }
    },
  },
  NodeHelperPanel: UserManual,
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"],
        width: 250,
        height: 68,
        outputSchema: {
          name: "output",
          type: "ͼOBJECTͼ",
          children: [
            { name: "header", type: "ͼOBJECTͼ" },
            { name: "body", type: "ͼOBJECTͼ" },
          ],
        },
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    if (!nodeData.props.input) {
      return "Http input is required!";
    }
  },
};

export default config;
