# w-dwdata-tweq 經驗

## 1. wsemi 列舉函數第 2 參數改為 opt(2026-11-26,Gitea #220)

- 舊寫法(第 2 參數為數字層數)於新版拋 `invalid opt: must be an object`;省略第 2 參數(舊預設 1 層)則靜默變窮舉。本庫唯一站點為預設 `funGetCurrent`,改為 `{ levelLimit: 1 }`,語意不變(只列第 1 層)。
- **層數之觀察須用 `fs.readFileSync` 替身**:該站點逐項 `JSON.parse(fs.readFileSync(path))` 而不濾除資料夾項目,第 1 層有子資料夾時,第 1 層列舉與窮舉列舉都於讀取該資料夾項目時失敗(EISDIR),只看結果分不出層數;替身只攔截 `fdDwCurrent` 之下之路徑、對資料夾回傳固定 JSON 使讀取不中斷,其餘委託原函數,測試後以 `mock.restore()` 還原。`src` 以 `fs.readFileSync(...)` 呼叫(非具名匯入),替身才攔得到。
- 修前版對 wsemi 1.9.80 之測試為紅(`invalid opt: must be an object`);取法:`git show HEAD:<檔>` 寫入 `./tmp/` 之鏡像根,以鏡像根為工作目錄跑 mocha。變異/修前鏡像根跑 mocha 建議加 `--exit`(失敗案可能使假伺服器未關而不退出)。
