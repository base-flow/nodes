export default {
  name: "@baseflow-nodes/flow",
  version: "1.0.0",
  baseflow: {
    type: "Flow",
    name: "流程",
    icon: "",
    desc: "流程：定义一个独立的流程",
  },
  scripts: {
    typecheck: "tsc --noEmit",
    "build:js": "rollup -c",
  },
};
