const { FlowErrors, getLocale, NodeType } = Baseflow;

const META = {
  type: "End",
  name: "流程结束",
  icon: "",
  desc: "流程结束：流程正常执行完成，可以设置返回数据",
};
const locale = getLocale();

const config = {
  version: "1.0.0",
  type: NodeType.End,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"],
  backend: {},
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"],
        width: 250,
        height: 68,
        valueReference: { path: "flow" },
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    if (nodeData.meta.configurationErrors === FlowErrors.returnSchemaChanged) {
      return FlowErrors.returnSchemaChanged;
    }
  },
};

export default config;
