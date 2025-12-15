import type { INodeConfig, IValueSource } from "@baseflow/react";
import { DataType, NodeType, ValueSource } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { DSLProps, NodeProps } from "./model";
import PKG from "./package.json";

const config: INodeConfig<NodeProps, DSLProps> = {
  version: PKG.version,
  type: NodeType.Loop,
  icon: "",
  desc: "Foreach：通过指定一个迭代源来循环执行子节点",
  NodeInputPanel,
  backend: {},
  defaultData() {
    return {
      meta: {
        name: "迭代Foreach",
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    if (!nodeData.props.source) {
      return "Foreach source is required!";
    }
  },
  propsRender: {
    out(props) {
      const source = props.source?.value.text;
      return { source };
    },
    in(dsl) {
      const { source } = dsl;
      if (source) {
        const sourceType: IValueSource = /\D/.test(source) ? ValueSource.Variable : ValueSource.Template;
        return { source: { name: "source", value: { type: DataType.Array, source: sourceType, text: source }, children: [] } };
      } else {
        return { source: undefined };
      }
    },
  },
};

export default config;
