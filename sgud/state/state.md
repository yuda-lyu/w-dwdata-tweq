# w-dwdata-tweq 狀態(現況)

> 只記現況,不寫過程(過程見 `sgud/exp/experience.md`)。規則見 `sgud/rule/rulebook.md`。

## 1. wsemi 列舉函數之第 2 參數遷移(R-WS-01、R-WS-02)

- 2026-11-26 完成。現行依賴:`wsemi` ^1.9.83、`w-dwdata-builder` ^1.1.46、`w-package-tools` ^1.1.32(devDependencies)。
- 站點全集(`src` 僅 1 處,README 與根目錄範例無列舉呼叫):`src/WDwdataTweq.mjs:251` 預設 `funGetCurrent`:`fsTreeFolder(fdDwCurrent, { levelLimit: 1 })`,語意為只列第 1 層,與舊寫法(第 2 參數為數字 1)一致。
- 測試:`test/unit-levelLimit.test.mjs` 為層數語意案;該站點改為省略第 2 參數或 `{ levelLimit: 2 }` 之變異皆使該案轉紅;修前版(舊寫法)對 wsemi 1.9.80 之既有測試為 13 綠、11 紅(`invalid opt: must be an object`)。
- 已知缺口:該站點之消費端逐項讀取並 `JSON.parse`,未濾除資料夾項目,`fdDwCurrent` 第 1 層含子資料夾時預設 `funGetCurrent` 會因讀取資料夾(EISDIR)而失敗(與列舉層數無關,舊寫法亦然);正常流程下 `fdDwCurrent` 只含檔案。屬範圍外,未修。

## 2. 逐項處理失敗之行為(R-IF-01、R-IF-02)

- 2026-11-28:依 `w-dwdata-builder` ^1.1.46(其依賴 `w-data-scheduler` ^1.0.77)之行為改寫測試,`src` 未改(Gitea #216)。
- 現行行為(由依賴提供):`funAdd`、`funModify`、`funRemove` 單項失敗不中止本輪,另發 1 筆 `warn` 事件 `fail-items-stage-main`;`fdDwCurrent` 只收處理成功之項,失敗與未處理者維持前次內容而下輪重試;`end` 事件帶本輪結果 `{ success, failed, msgCancel }`。本庫不提供 `funBeforeEnd` 設定。以預設 `funDownload`、`funGetCurrent` 多輪實跑確認(下輪重試、修好後入庫、下載回應非 2xx 時 `fdDwCurrent` 不變)。
- 測試:`npm test`(5 檔 32 案)全綠;`test/unit-srLog.test.mjs` 14 案。
- 已知缺口(未修):
  - `src/WDwdataTweq.mjs` 之 JSDoc 仍寫 `srLog.warn`「目前保留未使用」,且稱前次數據於結束前自動備份至 `fdDwCurrent`(現只收成功項);待裁示是否更新(`docs/` 由 JSDoc 產製,README 無相關敘述)。
  - 預設 `funDownload` 不清空 `fdDwAttime`:已移出下載區間之項,其舊檔於全部成功之輪仍被同步回 `fdDwCurrent`,下輪再次判為刪除而重複呼叫 `funRemove`(舊依賴下相同,非本次造成)。
