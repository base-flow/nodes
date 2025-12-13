import type { INodeInputPanel, SchemaModel } from "@baseflow/react";
import { BaseLang, DataType, SchemaModelForm } from "@baseflow/react";
import { Alert } from "antd";
import { memo, useRef } from "react";
import type { NodeProps } from "../model";

const defaultInput: SchemaModel = { name: "input", type: DataType.Object, children: [] };
const defaultReturn: SchemaModel = { name: "return", type: DataType.Object, children: [] };

const Component: INodeInputPanel<NodeProps> = ({ _node, _graph }) => {
  const inputSchema = _graph.getInputSchema();
  const returnSchema = _graph.getReturnSchema();
  const inputSchemaChanged = useRef(false);
  const returnSchemaChanged = useRef(false);

  return (
    <div>
      {inputSchemaChanged.current && <Alert style={{ marginBottom: "20px" }} title={BaseLang.inputSchemaChanged} type="warning" showIcon />}
      {returnSchemaChanged.current && <Alert style={{ marginBottom: "20px" }} title={BaseLang.returnSchemaChanged} type="warning" showIcon />}
      <div className="nd-form-layout">
        <div className="form-item">
          <div className="label-item">流程入参</div>
          <div className="input-item nd-schema-filled">
            <SchemaModelForm
              variant="filled"
              defaultValue={defaultInput}
              value={inputSchema}
              onChange={(inputSchema: SchemaModel | undefined) => {
                inputSchemaChanged.current = true;
                _graph.setInputSchema(inputSchema);
                _node.updateMeta({ summary: [inputSchema && "[✓入参]", returnSchema && "[✓返回]"].filter(Boolean).join(", ") });
              }}
            />
          </div>
        </div>
        <div className="form-item">
          <div className="label-item">流程返回</div>
          <div className="input-item nd-schema-filled">
            <SchemaModelForm
              variant="filled"
              defaultValue={defaultReturn}
              value={returnSchema}
              onChange={(returnSchema: SchemaModel | undefined) => {
                returnSchemaChanged.current = true;
                _graph.setReturnSchema(returnSchema);
                // This operation sets the returnSchema on the flow node, not on the current node itself.
                // Therefore, the nodeData of the current node remains unchanged, which means the UI rendering will not update automatically.
                // Thus, you need to manually invoke refreshUI().
                _node.updateMeta({ summary: [inputSchema && "[✓入参]", returnSchema && "[✓返回]"].filter(Boolean).join(", ") }, _node.refreshUI);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(Component);
