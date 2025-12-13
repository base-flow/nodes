import type { INodeConfig } from '@baseflow/react';
import type { NodeProps } from './model';
import { NodeType } from '@baseflow/react';
import NodeInputPanel from './components/NodeInputPanel';
import PKG from './package.json';
import UserManual from './UserManual';

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Task,
  icon: '',
  desc: 'HTTP请求：通过置请求参数发送HTTP请求，并输出响应数据',
  NodeInputPanel,
  NodeOutputPanel: {
    editable: true,
    toolsFilter: (item, parent) => {
      if (!parent) {
        return { addNext: false, addChild: false, edit: false, delete: false };
      }
      if (parent.name === 'response') {
        return { addNext: false, addChild: true, edit: false, delete: false };
      }
    },
  },
  NodeHelperPanel: UserManual,
  backend: {},
  defaultData(graph) {
    return {
      meta: {
        name: '发送HTTP请求',
        width: 250,
        height: 68,
        outputSchema: { name: 'output', type: 'ͼOBJECTͼ', children: [
          { name: 'header', type: 'ͼOBJECTͼ' },
          { name: 'body', type: 'ͼOBJECTͼ' },
        ] },
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    if (!nodeData.props.input) {
      return 'Http input is required!';
    }
  },
};

export default config;
