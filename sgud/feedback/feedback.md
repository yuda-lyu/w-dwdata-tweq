# w-dwdata-tweq 回饋

> 只列紀錄與提案(日期、類別、對象、內容、依據);實際修改依流程另行處理。

| 日期 | 類別 | 對象 | 內容 | 依據 |
|---|---|---|---|---|
| 2026-11-28 | 自有套件 | w-dwdata-tweq(預設 `funDownload`;`w-dwdata-builder` 之完全同步) | 預設 `funDownload` 下載前不清空 `fdDwAttime`,已移出下載區間之項其舊檔仍在;全部成功之輪完全同步會把它搬回 `fdDwCurrent`,下輪再判為刪除而重複呼叫 `funRemove`。提案:預設 `funDownload` 寫檔前清空 `fdDwAttime`(下載失敗之輪本就不同步),附多輪測試 | 以預設 `funDownload`、`funGetCurrent` 多輪實跑:第 2、3 輪皆判 `remove`、`success.remove` 有該項而 `fdDwCurrent` 仍含之;舊版依賴(builder 1.1.45、排程器 1.0.76)下相同 |
