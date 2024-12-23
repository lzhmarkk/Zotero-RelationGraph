import { config } from "../package.json";
import { ColumnOptions } from "zotero-plugin-toolkit/dist/helpers/virtualizedTable";
import hooks from "./hooks";
import { createZToolkit } from "./utils/ztoolkit";
import GraphView from "./modules/graphview";
import Utils from "./utils/utils";

class Addon {
  public data: {
    alive: boolean;
    config: typeof config;
    // Env type, see build.js
    env: "development" | "production";
    ztoolkit: ZToolkit;
    locale?: {
      current: any;
    };
    prefs?: {
      window: Window;
      columns: Array<ColumnOptions>;
      rows: Array<{ [dataKey: string]: string }>;
    };
    graph?: GraphView;
    utils: Utils;
  };
  // Lifecycle hooks
  public hooks: typeof hooks;
  // APIs
  public api: object;

  constructor() {
    this.data = {
      alive: true,
      config,
      env: __env__,
      ztoolkit: createZToolkit(),
      utils: new Utils()
    };
    this.hooks = hooks;
    this.api = {};
  }
}

export default Addon;
