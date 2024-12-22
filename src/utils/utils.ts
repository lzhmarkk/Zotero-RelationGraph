import PDF from "./pdf";


class Utils {
  PDF: PDF;
  private lock?: _ZoteroTypes.PromiseObject;
  private cache: { [key: string]: any } = {};
  public regex = {
    DOI: /10\.\d{4,9}\/[-._;()/:A-z0-9><]+[^.\]]/,
    arXiv: /arXiv[.:](\d+\.\d+)/,
    URL: /https?:\/\/[^\s.]+/
  }
  constructor() {
    this.PDF = new PDF(this);
  }

  public getIdentifiers(text: string): ItemBaseInfo["identifiers"] {
    const targets = [
      {
        key: "DOI",
        ignoreSpace: true,
        regex: this.regex.DOI
      },
      {
        key: "arXiv",
        ignoreSpace: true,
        regex: this.regex.arXiv
      }
    ]
    const identifiers: any = {}
    for (const target of targets) {
      const res = (
        target.ignoreSpace ? text.replace(/\s+/g, "") : text
      ).match(target.regex)
      if (res) {
        identifiers[target.key] = res.slice(-1)[0]
      }
    }
    return identifiers
  }

  private extractURL(text: string) {
    const res = text.match(this.regex.URL)
    if (res) {
      return res.slice(-1)[0]
    }
  }

  public parseRefText(text: string): { year?: string, authors?: string[], title: string, publicationVenue?: string } {
    try {
      text = text.replace(/^\[\d+?\]/, "")
      text = text.replace(/\s+/g, " ")
      // 匹配标题
      // 引号引起来，100%是标题
      let title: string, titleMatch: string
      if (/\u201c(.+)\u201d/.test(text)) {
        [titleMatch, title] = text.match(/\u201c(.+)\u201d/)!
        if (title.endsWith(",")) {
          title = title.slice(0, -1)
        }
      } else {
        title = titleMatch = ((text.indexOf(". ") != -1 && text.match(/\.\s/g)!.length >= 2) && text.split(". ") || text.split("."))
          // 找出最长的两个，其中一个最有可能是一堆作者，另一个最有可能是标题
          .sort((a, b) => b.length - a.length)
          // 统计它们中缩写以及符号出现的次数，出现次数最多的有可能是作者
          .map((s: string) => {
            let count = 0;
            [/[A-Z]\./g, /[,.\-():]/g, /\d/g].forEach(regex => {
              const res = s.match(regex)
              count += (res ? res.length : 0)
            })
            return [count / s.length, s]
          })
          // 过滤期刊描述
          .filter((s: any) => s[1].match(/\s+/g)?.length >= 3)
          .sort((a: any, b: any) => a[0] - b[0])![0][1] as string
        if (/\[[A-Z]\]$/.test(title)) {
          title = title.replace(/\[[A-Z]\]$/, "")
        }
      }
      title = title.trim()
      const splitByTitle = text.split(titleMatch)
      let authorInfo = splitByTitle[0].trim()

      // ztoolkit.log(splitByTitle[1])

      const publicationVenue = splitByTitle[1].match(/[^.\s].+[^.]/)![0].split(/[,\d]/)[0].trim()
      if (authorInfo.indexOf("et al.") != -1) {
        authorInfo = authorInfo.split("et al.")[0] + "et al."
      }
      const currentYear = new Date().getFullYear();
      const res = text.match(/[^\d]\d{4}[^\d-]/g)?.map(s => s.match(/\d+/)![0])
      const year = res!.find(s => {
        return Number(s) <= Number(currentYear) + 1
      })!
      authorInfo = authorInfo.replace(`${year}.`, "").replace(year, "").trim()
      return { year, title, authors: [authorInfo], publicationVenue }
    } catch {
      return {
        title: text
      }
    }

  }

  public identifiers2URL(identifiers: ItemBaseInfo["identifiers"]) {
    let url
    if (identifiers.DOI) {
      url = `https://doi.org/${identifiers.DOI}`
    }
    if (identifiers.arXiv) {
      url = `https://arxiv.org/abs/${identifiers.arXiv}`
    }
    return url
  }

  public refText2Info(text: string): ItemBaseInfo {
    const identifiers = this.getIdentifiers(text)
    return {
      identifiers: identifiers,
      url: this.extractURL(text) || this.identifiers2URL(identifiers),
      authors: [],
      ...this.parseRefText(text),
      type: (identifiers.arXiv ? "preprint" : "journalArticle")
    }
  }

  private get_title_from_text(info:ItemInfo){
    if (!info.text) { return }
    const chunks = info.text.split(new RegExp("[^A-Z]\\. "))

    const filtered_chunks = chunks.filter(chunk => {
      const is_authors =
        (chunk.indexOf(", ") != -1 && chunk.split(', ').every(c => {
          return c.indexOf(String(' ')) != -1}))
        || chunk.indexOf(String("et a")) != -1

      const is_date = !!chunk.match(new RegExp("\\d{3,}"))

      return !is_authors && !is_date
    })

    return filtered_chunks[0]
  }

  public async searchItem(info: ItemBaseInfo) {
    if (!info) { return }

    const s = new Zotero.Search;
    s.addCondition("joinMode", "any");

    if (info.identifiers.DOI) {
      s.addCondition("DOI", "is", info.identifiers.DOI);
      s.addCondition("DOI", "is", info.identifiers.DOI.toLowerCase());
      s.addCondition("DOI", "is", info.identifiers.DOI.toUpperCase());
    }
    else {
      const title = this.get_title_from_text(info)

      if (title && title?.length > 8) {
        s.addCondition("title", "contains", title);
      }
      s.addCondition("url", "contains", info.identifiers.arXiv!);
      s.addCondition("url", "contains", info.identifiers.CNKI!);
    }

    const ids = await s.search();
    const items = (await Zotero.Items.getAsync(ids)).filter(i => {
      return (
        !i.itemType.startsWith("attachment") &&
        i.isRegularItem && i.isRegularItem()
      )
    });

    if (items.length) {
      return items[0]
    }
  }

  /**
   * 搜索本地，获取参考文献的本地item引用
   * @param info 
   * @returns 
   */
  public async searchLibraryItem(info: ItemBaseInfo): Promise<Zotero.Item | undefined> {
    await Zotero.Promise.delay(0)

    const title = this.get_title_from_text(info)!
    ztoolkit.log("phased candidate title", title)


    const getPureText = (s:string) => s?.toLowerCase().match(/[0-9a-z\u4e00-\u9fa5]+/g)!.join("")

    const all_items: Zotero.Item[] = (await Zotero.Items.getAll(1)).filter(i => (
      i.isRegularItem() && i.getField("title"))
    )

    // get results
    const search_res = await this.searchItem(info)

    const filter_res = all_items
      .find((item: Zotero.Item) => {
        const searchTitle = getPureText(title)
        const item_title = getPureText(item.getField("title"))

        if (searchTitle && title &&
          searchTitle.length > 10 && title.length > 10 &&
          (item_title?.indexOf(searchTitle) != -1 || searchTitle?.indexOf(item_title) != -1)) {
          return item;
        }
      })

    return search_res || filter_res

    }
  

  public getItemType(item: Zotero.Item) {
    if (!item) { return }
    return Zotero.ItemTypes.getName(
      item.getField("itemTypeID" as any) as unknown as number,
    );
  }

  public isChinese(text: string) {
    text = text.replace(/\s+/g, "")
    return (text.match(/[\u4E00-\u9FA5]/g)?.length || 0) / text.length > .5
  }

  public isDOI(text: string) {
    if (!text) { return false }
    const res = text.match(this.regex.DOI)
    if (res) {
      return res[0] == text && !/(cnki|issn)/i.test(text)
    } else {
      return false
    }
  }

  public matchArXiv(text: string) {
    const res = text.match(this.regex.arXiv)
    if (res != null && res.length >= 2) {
      return res[1]
    } else {
      return false
    }
  }

  public Html2Text(html: string): string | null {
    if (!html) { return "" }
    let text
    try {
      let span: HTMLSpanElement | null = Zotero.getMainWindow().document.createElement("span")
      span.innerHTML = html
      text = span.innerText || span.textContent
      span = null
    } catch (e) {
      text = html
    }
    if (text) {
      text = text
        .replace(/<([\w:]+?)>([\s\S]+?)<\/\1>/g, (match, p1, p2) => p2)
        .replace(/\n+/g, "")
    }
    // ztoolkit.log(text)
    return text
  }

  public getReader() {
    return Zotero.Reader.getByTabID(ztoolkit.getGlobal("Zotero_Tabs").selectedID)
  }

  public copyText = (text: string, show: boolean = true) => {
    (new ztoolkit.Clipboard()).addText(text, "text/unicode").copy();
    if (show) {
      (new ztoolkit.ProgressWindow("Copy"))
        .createLine({ text: text, type: "success" })
        .show()
    }
  }

  public getItem(): Zotero.Item | undefined {
    const reader = this.getReader()
    if (reader) {
      return reader._item.parentItem 
    }
  }

  public abs(v: number) {
    return v > 0 ? v : -v
  }
}

export default Utils