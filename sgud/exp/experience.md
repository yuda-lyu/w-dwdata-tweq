# w-dwdata-tweq 經驗

## 1. wsemi 列舉函數第 2 參數改為 opt(2026-11-26,Gitea #220)

- 舊寫法(第 2 參數為數字層數)於新版拋 `invalid opt: must be an object`;省略第 2 參數(舊預設 1 層)則靜默變窮舉。本庫唯一站點為預設 `funGetCurrent`,改為 `{ levelLimit: 1 }`,語意不變(只列第 1 層)。
- **層數之觀察須用 `fs.readFileSync` 替身**:該站點逐項 `JSON.parse(fs.readFileSync(path))` 而不濾除資料夾項目,第 1 層有子資料夾時,第 1 層列舉與窮舉列舉都於讀取該資料夾項目時失敗(EISDIR),只看結果分不出層數;替身只攔截 `fdDwCurrent` 之下之路徑、對資料夾回傳固定 JSON 使讀取不中斷,其餘委託原函數,測試後以 `mock.restore()` 還原。`src` 以 `fs.readFileSync(...)` 呼叫(非具名匯入),替身才攔得到。
- 修前版對 wsemi 1.9.80 之測試為紅(`invalid opt: must be an object`);取法:`git show HEAD:<檔>` 寫入 `./tmp/` 之鏡像根,以鏡像根為工作目錄跑 mocha。變異/修前鏡像根跑 mocha 建議加 `--exit`(失敗案可能使假伺服器未關而不退出)。

## 2. 依賴之逐項失敗行為改變使事件序列斷言轉紅(2026-11-28,Gitea #216)

- 排程器 1.0.77 起單項失敗不再取消本輪,`unit-srLog` 之 `funAdd` 拋錯序列與 console 計數轉紅(5 案)。期望值以暫存探測腳本在新依賴下實跑印出實際事件、`srLog` 與 console 後核對,不憑推論。
- 單項失敗後 console 不再有取消訊息,原本唯一斷言取消訊息輸出之案因此失去覆蓋:另以 `funDownload` 拋錯(仍取消本輪)補案,並讓 `useShowLog: false` 案兩種錯誤皆跑。
- 鑑別力:把舊版依賴以 `npm pack` 解到 `./tmp/` 之鏡像根(`node_modules` 只放舊版 builder 與排程器,其餘向上解析)跑改寫後之測試,斷言新行為之 6 案轉紅;另於鏡像根對依賴植入 `warn` 與取消訊息之變異,皆轉紅。
