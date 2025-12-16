const { getLocale, NodeType } = Baseflow;

import PKG from "./a.js";

const META = PKG.baseflow;
const locale = getLocale();

const config = {
  version: PKG.version,
  type: NodeType.Start,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"],
  backend: {
    node: "",
  },
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
