import { config } from "../../package.json";
import { getPref, setPref } from "../utils/prefs";

export default class GraphView {
  private renderer: any;
  private container!: HTMLDivElement;
  private resizer!: HTMLDivElement;
  private graph!: Graph;
  private window!: Window;
  private urls: any = {
    Zotero: "https://www.zotero.org/",
    Style: "https://github.com/MuiseDestiny/zotero-style",
    Help: "https://github.com/MuiseDestiny/zotero-style#zotero-style",
    Share: "https://github.com/MuiseDestiny/zotero-style/issues/48",
    Issue: "https://github.com/MuiseDestiny/zotero-style/issues/new/choose",
    Plugins: "https://zotero-chinese.gitee.io/zotero-plugins/#/",
  };
  private cache: any = {};
  private mode = "default";
  private modeFunction: { [mode: string]: any };

  constructor() {
    this.modeFunction = {
      default: this.getGraphByDefaultLink.bind(this),
      citation: this.getGraphByCitationLink.bind(this),
      author: this.getGraphByAuthorLink.bind(this),
      tag: this.getGraphByTagLink.bind(this),
    };
  }

  public async init(window: Window) {
    this.window = window;

    this.registerButton("citation");
    this.registerButton("author");
    this.registerButton("tag");

    await this.createContainer(window);

    return this;
  }

  async open_graph(mode: string, selected_items: Zotero.Item[], force_open:boolean=false) {
    const node = this.container;
    if (!node) {
      return;
    }

    if (node.style.display == "none") {
      // not open
      node.style.display = "";
      setPref(`${config.addonRef}.graphView.enable`, true);
      this.mode = mode;
      this.setData(await this.getGraph(selected_items));
    } else {
      // opened
      if (this.mode == mode && !force_open) {// close
        node.style.display = "none";
        setPref(`${config.addonRef}.graphView.enable`, false);
      } else { // switch graph
        this.mode = mode;
        this.setData(await this.getGraph(selected_items));
      }
    }
  }

  private registerButton(mode: string) {
    const document = this.window.document;

    const newNode = ztoolkit.UI.createElement(document, "toolbarbutton", {
      id: `zotero-relationGraph-graphview-${mode}`,
      attributes: {
        tooltiptext: `${mode} graph`,
      },
    });
    newNode.style.listStyleImage = `url(chrome://${config.addonRef}/content/icons/32x32/${mode}.png)`;

    const toolbar = document.getElementById("zotero-items-toolbar");
    const ref_node = document.getElementById("zotero-tb-search");
    toolbar!.insertBefore(newNode, ref_node);

    newNode.addEventListener("mousedown", async (event: any) => {
      if (event.button == 0 || event.button == 2) {
        await this.open_graph(mode, []);
      }
    });
  }

  // todo 多选
  /**
   * 这里学习connected papers只显示一个姓氏
   * 比较简洁，当前版本使用item.id作为id，无需担心重复问题
   * @param item
   * @returns
   */
  static getItemDisplayText(item: Zotero.Item) {
    const authors = item.getCreators();
    if (authors.length == 0) {
      return item.getField("title");
    }
    const author = authors[0].lastName;
    const year = item.getField("year");
    return `${author}, ${year}`;
  }

  private async getGraph(
    selected_items: Zotero.Item[] = [],
    cache: boolean = false,
  ) {

    let items=[];
    if (selected_items.length == 0) {
       items = ztoolkit.getGlobal("ZoteroPane").getSortedItems();
    } else {
       items = selected_items;
    }



    const collection = ztoolkit.getGlobal("ZoteroPane").getSelectedCollection();
    const collectionKey = collection ? collection.key : "My Library";
    if (cache && (this.cache[this.mode] ??= {})[collectionKey]) {
      return this.cache[this.mode][collectionKey];
    }
    const graph = await this.modeFunction[this.mode](items);
    (this.cache[this.mode] ??= {})[collectionKey] = graph;
    this.graph = graph;
    return graph;
  }

  private getGraphByDefaultLink() {
    return {
      nodes: {
        // url
        Zotero: { links: { Style: true }, type: "url" },
        Style: { links: { Zotero: true }, type: "url" },
        Help: { links: { Style: true }, type: "url" },
        Share: { links: { Style: true }, type: "url" },
        Issue: { links: { Style: true }, type: "url" },
        Plugins: { links: { Zotero: true, Style: true }, type: "url" },
        // function
        Theme: { links: { Style: true }, type: "tag" },
        light: { links: { Theme: true }, type: "function" },
        dark: { links: { Theme: true }, type: "function" },
      },
    };
  }

  private getGraphByCitationLink(items: Zotero.Item[]) {
    const nodes: Graph["nodes"] = {};
    const graph: Graph = { nodes };
    items.forEach((item, i) => {
      const id = item.id;
      nodes[id] = { links: {}, type: "item" };
      const relatedKeys = item.relatedItems;
      items.forEach((_item, _i) => {
        if (_i == i) {
          return;
        }
        if (relatedKeys.indexOf(_item.key) != -1) {
          nodes[id].links[_item.id] = true;
        }
      });
    });
    return graph;
  }

  private async getGraphByItemArrLink(items: Zotero.Item[], getArr: any) {
    const nodes: { [key: string]: any } = {};
    const graph: { [key: string]: any } = { nodes };
    const sharedValues: { [key: string]: { items: Set<Zotero.Item> } } = {};

    // 找出所有共享值
    items.forEach((item) => {
      const values = getArr(item);
      if (values.length == 0) {
        nodes[item.id] = { links: {}, type: "item" };
      }
      values.forEach((value: string) => {
        if (!Object.prototype.hasOwnProperty.call(sharedValues, value)) {
          sharedValues[value] = { items: new Set() };
        }
        sharedValues[value].items.add(item);
      });
    });
    // 根据分位点，计算临界值
    const pct = 0.9;
    const countArr = Object.values(sharedValues)
      .map((i) => i.items.size)
      .filter((i) => i > 1)
      .sort();
    const limit = countArr[parseInt((countArr.length * pct).toFixed(0))];
    // 创建节点对象
    Object.keys(sharedValues).forEach((value: string) => {
      const items = [...sharedValues[value].items];
      items.forEach((item) => {
        nodes[item.id] ??= { links: {}, type: "item" };
        if (items.length >= limit) {
          nodes[item.id].links[value] = true;
          (nodes[value] ??= { links: {}, type: "tag" }).links[item.id] = true;
        }
        items
          .filter((i) => i != item)
          .forEach((_item) => {
            nodes[item.id].links[_item.id] = true;
          });
      });
    });
    return graph;
  }

  private getGraphByAuthorLink(items: Zotero.Item[]) {
    const getAuthors = (item: Zotero.Item) => {
      return item.getCreators().map((a) => {
        return `${a.firstName} ${a.lastName}`;
      });
    };
    return this.getGraphByItemArrLink(items, getAuthors);
  }

  private getGraphByTagLink(items: Zotero.Item[]) {
    const getTags = (item: Zotero.Item) => {
      const allTags = item
        .getTags()
        .map((tag) => tag.tag)
        .filter((i) => !i.startsWith("/"));
      const tags: string[] = [];
      allTags.forEach((tag) => {
        tags.push(tag);
        tag.split("/").forEach((i) => tags.push(i));
      });
      return tags;
    };
    return this.getGraphByItemArrLink(items, getTags);
  }

  private async createContainer(window: Window) {
    const document = window.document;
    document.querySelectorAll("#graph").forEach((e) => e.remove());
    document.querySelectorAll(".resizer").forEach((e) => e.remove());
    while (!document.querySelector("#item-tree-main-default")) {
      await Zotero.Promise.delay(100);
    }

    const mainNode = document.querySelector(
      "#item-tree-main-default",
    )! as HTMLDivElement;

    // 图形容器
    const minHeight = 200;
    const container: HTMLDivElement = ztoolkit.UI.createElement(
      document,
      "div",
      {
        id: "zotero-relationGraph-container",
        styles: {
          width: "100%",
          minHeight: `${minHeight}px`,
          height: Zotero.Prefs.get(
            `${config.addonRef}.graphView.height`,
          ) as string,
          display: Zotero.Prefs.get(`${config.addonRef}.graphView.enable`)
            ? ""
            : "none",
          backgroundColor: "transparent",
          position: "relative",
        },
      },
    );

    // 标题
    const title = ztoolkit.UI.createElement(document, "h4", {
      id: "zotero-relationGraph-title",
      styles: {
        textAlign:"center",
        margin : "0px",
        border : "3px"
      }
    });
    container.appendChild(title);

    //关闭按钮
    const close_button:HTMLButtonElement = ztoolkit.UI.createElement(document, "button", {
      id: "zotero-relationGraph-closeButton",
      styles: {
        position: "absolute",
        top:"10px",
        right: "10px",
        width: "25px",
        height: "25px",
        backgroundColor: "#9f9f9f",
        cursor: "pointer",
        borderRadius: "10px",
        padding: "0px",
        boxSizing: "border-box",
      },
    })
    close_button.innerText = 'x'
    close_button.addEventListener("mousedown", async (event: any) => {
      this.container.style.display = "none";
      setPref(`${config.addonRef}.graphView.enable`, false);
    });
    container.appendChild(close_button);

    // 选项
    const optionContainer = ztoolkit.UI.appendElement(
      {
        tag: "div",
        styles: {
          position: "absolute",
          left: "0",
          bottom: "0",
          height: "2em",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          opacity: "0",
          transition: "opacity .23s linear",
        },
        listeners: [
          {
            type: "mouseenter",
            listener: () => {
              optionContainer.style.opacity = "1";
            },
          },
          {
            type: "mouseleave",
            listener: () => {
              optionContainer.style.opacity = "0";
            },
          },
        ],
      },
      container,
    ) as HTMLDivElement;

    const frame = ztoolkit.UI.createElement(document, "iframe", {
      namespace: "html",
    }) as HTMLIFrameElement;
    frame.setAttribute(
      "src",
      `chrome://${config.addonRef}/content/dist/index.html`,
    );
    frame.style.border = "none";
    frame.style.outline = "none";
    frame.style.width = "100%";
    frame.style.height = "100%";
    frame.style.overflow = "hidden";
    frame.style.backgroundColor = "transparent";
    container.append(frame);
    mainNode.append(container);
    this.container = container;

    // 调节高度
    const resizer = ztoolkit.UI.createElement(document, "div", {
      styles: {
        height: `3px`,
        width: "100%",
        backgroundColor: "#000",
        cursor: "ns-resize",
      },
    });
    this.resizer = resizer;
    container.insertBefore(resizer, title);

    let y = 0,
      x = 0;
    let h = 0,
      w = 0;
    const mouseDownHandler = function (e: MouseEvent) {
      frame.style.display = "none";
      y = e.clientY;
      x = e.clientX;
      const rect = container.getBoundingClientRect();
      h = rect.height;
      w = rect.width;
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };
    const mouseMoveHandler = (e: MouseEvent) => {
      const dy = e.clientY - y;
      const hh = h - dy;
      const height = `${hh <= minHeight ? minHeight : hh}px`;
      container.style.height = height;
      window.setTimeout(() => {
        frame.style.height = height;
        // @ts-ignore
        frame.contentDocument!.querySelector("#graph-view").style.height =
          height;
        this.renderer.onResize();
        Zotero.Prefs.set(`${config.addonRef}.graphView.height`, height);
      });
    };
    const mouseUpHandler = () => {
      frame.style.display = "";
      this.renderer.onResize();
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
    resizer.addEventListener("mousedown", mouseDownHandler);

    await this.initIFrame(window, frame);
    // this.setTheme()
  }

  private async initIFrame(window: Window, frame: HTMLIFrameElement) {
    const pane = Zotero.getZoteroPanes()[0];

    // 等待js执行结束
    // @ts-ignore
    while (!frame.contentWindow!.renderer) {
      await Zotero.Promise.delay(100);
    }
    // @ts-ignore
    const renderer = frame.contentWindow!.renderer;
    this.renderer = renderer;

    //@ts-ignore
    this.renderer.containerEl.style.height = window.getComputedStyle(
      this.container,
    ).height;

    let userSelect = true;
    const itemsview = pane.itemsView;
    if (itemsview) {
      itemsview.onSelect.addListener(() => {
        if (!userSelect) {
          userSelect = true;
          return;
        }
        const items = pane.getSelectedItems();
        if (items.length == 1) {
          const item = items[0];
          const itemID = item.id;
          const node = renderer.nodes.find(
            (node: any) => Number(node.id) == itemID,
          );
          renderer.highlightNode = node;
          if (!node) {
            return;
          }
          const f = window.devicePixelRatio;
          const scale = 2;
          const canvas = renderer.interactiveEl;
          const X = (f * canvas.width) / 2 - node.x * scale;
          const Y = (f * canvas.height) / 2 - node.y * scale;
          renderer.zoomTo(scale / 2);
          renderer.setPan(X, Y);
          renderer.setScale(scale);
          renderer.changed();
        }
      });
    }

    renderer.onNodeClick = (e: any, id: string, type: string) => {
      if (type == "item") {
        userSelect = false;
        if (pane.itemsView) {
          pane.itemsView.selectItem(Number(id));
        }
      } else if (type == "url") {
        Zotero.launchURL(this.urls[id]);
      } else if (type == "function") {
        // this.functions[id]()
      } else if (type == "tag") {
        // 查找tag对应的链接的条目，进行过滤
        const ids = Object.keys(this.graph.nodes[id].links).filter((id) => {
          return this.graph.nodes[id].type == "item";
        });
        pane.selectItems(ids.map(Number));
      }
    };

    frame.addEventListener("dblclick", () => {
      // 分析链接
      window.setTimeout(async () => {
        this.setData(await this.getGraph());
      });
    });

    frame.addEventListener("resize", () => {
      // renderer.interactiveEl.style.height = window.getComputedStyle(container).height
      renderer.onResize();
    });

    this.setData(await this.getGraph());
  }

  private setData(graph: any) {
    const title = this.window.document.getElementById(
      "zotero-relationGraph-title",
    );
    title!.textContent = `${this.mode} graph`;

    this.renderer.setData(graph);
    this.renderer.nodes.forEach((node: any) => {
      if (node._getDisplayText) {
        return;
      }
      node._getDisplayText = node.getDisplayText;
      node.getDisplayText = function () {
        if (this.type == "item") {
          return GraphView.getItemDisplayText(
            Zotero.Items.get(Number(this.id)),
          );
        }
        return this.id;
      };
    });
    this.renderer.changed();
    this.renderer.onResize();
  }
}

interface Graph {
  nodes: {
    [id: string]: {
      links: { [id: string]: boolean };
      type: string;
    };
  };
}
