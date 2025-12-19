var version = "0.0.1";
var baseflow = {
	type: "Branch",
	icon: "",
	name: "条件分支",
	desc: "条件分支：放置于[条件选择]中，通过设置执行条件来决定是否执行"
};
var executor = {
	node: "@baseflow-executors/branch@0.0.1"
};
var PKG = {
	version: version,
	baseflow: baseflow,
	executor: executor};

const META = PKG.baseflow;
const NodeSize = Baseflow.getNodeDefaultSize();
const locale = Baseflow.getLocale();
const config = {
  version: PKG.version,
  type: Baseflow.NodeType.Branch,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  executor: PKG.executor,
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        ...NodeSize
      },
      props: {}
    };
  },
  validate() {}
};

export { config as default };
