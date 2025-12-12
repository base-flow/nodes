import type { INodeConfig, JsonDSL } from "@baseflow/react";
import { BaseWidgets } from "@baseflow/react";
import type { IFLow } from "./entity";

function fetchFlow(): JsonDSL {
  const graphContent = localStorage.getItem("baseflow-dsl");
  return graphContent
    ? JSON.parse(graphContent)
    : {
        layout: "dagre",
        sources: {
          "@baseflow-nodes/flow": "@baseflow-nodes/flow@1.0.0",
          "@baseflow-nodes/start": "@baseflow-nodes/start@1.0.0",
          "@baseflow-nodes/end": "@baseflow-nodes/end@1.0.0",
        },
        nodes: {
          id: "flow",
          tag: "@baseflow-nodes/flow",
          meta: {
            name: "流程",
            width: 250,
            height: 68,
          },
          props: {},
          children: [
            {
              id: "start",
              tag: "@baseflow-nodes/start",
              meta: {
                name: "流程开始",
                width: 250,
                height: 68,
              },
              props: {},
            },
            {
              id: "end",
              tag: "@baseflow-nodes/end",
              meta: {
                name: "流程结束",
                width: 250,
                height: 68,
              },
              props: {},
            },
          ],
        },
        triggers: [],
        extend: {},
      };
}

export const MockFlow: IFLow = {
  id: "xxx",
  commitId: "",
  version: "",
  released: true,
  flow: fetchFlow(),
};

const devNodes: { [name: string]: boolean } = {
  "@baseflow-nodes/flow@1.0.0": true,
  "@baseflow-nodes/start@1.0.0": true,
  "@baseflow-nodes/end@1.0.0": true,
  "@baseflow-nodes/return@1.0.0": true,
  "@baseflow-nodes/return@latest": true,
  "@baseflow-nodes/http@1.0.0": true,
  "@baseflow-nodes/http@latest": true,
  "@baseflow-nodes/choice@1.0.0": true,
  "@baseflow-nodes/branch@1.0.0": true,
  "@baseflow-nodes/choice@latest": true,
  "@baseflow-nodes/branch@latest": true,
  "@baseflow-nodes/foreach@1.0.0": true,
  "@baseflow-nodes/foreach@latest": true,
  "@baseflow-nodes/task@1.0.0": true,
  "@baseflow-nodes/variable@1.0.0": true,
  "@baseflow-nodes/variable@latest": true,
  "@baseflow-nodes/variable-update@1.0.0": true,
  "@baseflow-nodes/variable-update@latest": true,
  "@baseflow-nodes/continue@1.0.0": true,
  "@baseflow-nodes/continue@latest": true,
  "@baseflow-nodes/break@1.0.0": true,
  "@baseflow-nodes/break@latest": true,
  "@baseflow-nodes/try-catch@1.0.0": true,
  "@baseflow-nodes/try-catch@latest": true,
  "@baseflow-nodes/trigger-webhook@1.0.0": true,
  "@baseflow-nodes/trigger-webhook@latest": true,
};

function nodeSourceToUrl(source: string) {
  if (devNodes[source]) {
    return `/src/_nodes/${source.split(/[/@]/)[2]}/index.ts`;
  }
  return source;
}

export function onImportNode(source: string): Promise<INodeConfig> {
  const url = nodeSourceToUrl(source);
  return import(/* @vite-ignore */ url).then(
    (mod) => {
      return mod.default;
    },
    (err) => {
      BaseWidgets.message.error(err.message);
      throw err;
    },
  );
}
