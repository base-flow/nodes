import type { INodeConfig } from '@baseflow/react';
import type { NodeProps } from './model';
import { DataType, NodeType } from '@baseflow/react';
import NodeInputPanel from './components/NodeInputPanel';
import PKG from './package.json';

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Variable,
  icon: '',
  desc: '变量定义：通过本节点可以定义多个流程变量',
  NodeInputPanel,
  backend: {},
  defaultData() {
    return {
      meta: {
        name: '变量定义',
        width: 250,
        height: 68,
        outputSchema: { name: 'output', type: DataType.Object, children: [{ name: 'new', type: DataType.String }] },
      },
      props: {},
    };
  },
  validate() {
  },
};

export default config;
