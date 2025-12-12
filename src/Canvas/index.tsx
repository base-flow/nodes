import type { CreatorPayload, GraphData, IGraph, IGraphOptions, INodeConfig, INodeData } from "@baseflow/react";
import { DefalutGraphHooks, DslTools, Flow, HistoryTools } from "@baseflow/react";
// import { Icons } from "@baseflow/widgets";
import { Button, Dropdown, Modal, notification, Spin, Tooltip } from "antd";
import type { FC } from "react";
import { memo, useCallback, useEffect, useState } from "react";
import type { IFLow } from "../entity";
import { GraphHooks } from "./GraphHooks";
import styles from "./index.module.scss";

const Component: FC<{ data: IFLow }> = (props) => {
  const [graph, setGraph] = useState<IGraph>();
  const [initGraphData] = useState<GraphData>(() => DslTools.jsonToGraph(props.data.flow));
  const [graphOptions] = useState<IGraphOptions>({});
  const [graphHooks] = useState(new GraphHooks(props.data));
  const [showNodeCreater, setShowNodeCreater] = useState<CreatorPayload>();

  const onInit = useCallback((graph: IGraph) => {
    // @ts-expect-error: dev test
    window.graph = graph;
    setGraph(graph);
  }, []);

  useEffect(() => {
    return () => {
      console.log("------uninstall");
    };
  }, []);

  return (
    <div className={styles.Canvas}>
      <div className={`${styles.Canvas}__hd`}>
        <div className="left">
          <div className="title">
            <span>New Flow</span>
          </div>
        </div>
        <div className="right">{graph && <HistoryTools graph={graph} />}</div>
      </div>
      <div className={`${styles.Canvas}__bd`}>
        {initGraphData && graphHooks ? <Flow options={graphOptions} initialData={initGraphData} graphHooks={graphHooks} onInit={onInit} onShowCreater={setShowNodeCreater} /> : <Spin />}
      </div>
    </div>
  );
};

export default memo(Component);
