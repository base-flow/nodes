import type { INodeInputPanel, SchemaModel, SchemaValue } from '@baseflow/react';
import type { NodeProps } from '../model';
import { DataType, SchemaValueForm, useEvent } from '@baseflow/react';
import { memo } from 'react';

const inputSchema: SchemaModel = {
  name: 'request',
  label: 'Request',
  type: 'ͼOBJECTͼ',
  children: [
    { name: 'url', type: 'ͼSTRINGͼ' },
    { name: 'method', type: 'ͼSTRINGͼ' },
    { name: 'https', type: DataType.Bool },
    { name: 'data', type: DataType.Date },
  ],
};

const Component: INodeInputPanel<NodeProps> = ({ nodeData, node }) => {
  const onInputChange = useEvent((input: SchemaValue | undefined) => {
    node.updateProps({ input });
  });
  return (
    <div>
      <SchemaValueForm schema={inputSchema} value={nodeData.props.input} onChange={onInputChange} />
    </div>
  );
};
export default memo(Component);
