const { getLocale, NodeType } = Baseflow;

const META = {
  type: "Flow",
  name: "流程",
  icon: "",
  desc: "流程：定义一个独立的流程",
};
const locale = getLocale();

const config = {
  version: "1.0.0",
  type: NodeType.Flow,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"],
  backend: {},
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"],
        width: 250,
        height: 68,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;
