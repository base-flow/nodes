import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pluginExternal from "vite-plugin-external";

const cdnExternals = {
  react: "React",
  "react-dom": "ReactDOM",
  "react-dom/client": "ReactDOM",
  dayjs: "dayjs",
  antd: "antd",
  "@baseflow/react": "Baseflow",
  "@baseflow/widgets": "BaseflowWidgets",
};
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    pluginExternal(cdnExternals),
  ].filter(Boolean),
});
