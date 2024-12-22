import ReaderTab = _ZoteroTypes.ReaderTab;

export async function updateItemReferences(item: Zotero.Item) {
  const pdf = await item.getBestAttachment();
  if (pdf && pdf.isPDFAttachment()) {
    Zotero.Reader.open(pdf.id)
      .then(async (reader) => {
        if (reader) {
          await Zotero.Promise.delay(1000);

          const candidates = await addon.data.utils!.PDF.getReferences(reader, false);

          const addRelatedPromises = candidates.map(
            async (candidate: ItemInfo) => {
              const matched = await addon.data.utils!.searchLibraryItem(candidate);
              if (matched) {
                item.addRelatedItem(matched);
              }
            },
          );

          await Promise.all(addRelatedPromises);
          await Zotero.Promise.delay(500);
          await item.saveTx().then(()=>{
            (reader as ReaderTab).close();
          });
        }
    });
  }
}
