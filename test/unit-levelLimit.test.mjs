import fs from 'fs'
import path from 'path'
import { mock } from 'node:test'
import _ from 'lodash-es'
import w from 'wsemi'
import assert from 'assert'
import WDwdataTweq from '../src/WDwdataTweq.mjs'
import { eq114115, eq114116 } from './lib/genEqs.mjs'


//規格(wsemi列舉函數之第2參數為opt, 未給opt.levelLimit即窮舉全部層級):
//預設funGetCurrent(src/WDwdataTweq.mjs之funGetCurrentDef)僅列fdDwCurrent第1層之項目(opt.levelLimit為1), 其子資料夾內之檔案不列入
//
//此站點之消費端逐項以fs.readFileSync讀取並JSON.parse, 未濾除資料夾項目; 資料夾項目於真實檔案系統無法被讀取(EISDIR),
//故第1層有子資料夾時, 不論列舉層數為何皆於讀取該資料夾項目時失敗, 黑箱(只看結果)無法分辨列舉層數;
//本測試以fs.readFileSync之替身觀察列舉所交出之項目: 替身僅攔截fdDwCurrent之下之路徑並記錄, 對資料夾回傳固定JSON使讀取不中斷, 其餘一律委託原函數
describe('levelLimit', function() {

    it('WDwdataTweq: 預設funGetCurrent只列fdDwCurrent第1層之項目, 其子資料夾內之檔案不被列入(fsTreeFolder之opt.levelLimit為1)', async () => {

        let tag = '_levelLimit'

        //fdTagRemove
        let fdTagRemove = `./${tag}_tagRemove`
        w.fsCleanFolder(fdTagRemove)

        //fdDwAttime
        let fdDwAttime = `./${tag}_dwAttime`
        w.fsCleanFolder(fdDwAttime)

        //fdDwCurrent, 預置前次數據: 第1層之檔案114115.json, 與子資料夾stray及其內之第2層檔案ghost.json
        let fdDwCurrent = `./${tag}_dwCurrent`
        w.fsCleanFolder(fdDwCurrent)
        fs.writeFileSync(`${fdDwCurrent}/${eq114115.id}.json`, JSON.stringify(eq114115), 'utf8')
        w.fsCreateFolder(`${fdDwCurrent}/stray`)
        fs.writeFileSync(`${fdDwCurrent}/stray/ghost.json`, JSON.stringify({ ...eq114116, id: 'ghost' }), 'utf8')

        //fdResult
        let fdResult = `./${tag}_result`
        w.fsCleanFolder(fdResult)

        //fdTaskCpActualSrc
        let fdTaskCpActualSrc = `./${tag}_taskCpActualSrc`
        w.fsCleanFolder(fdTaskCpActualSrc)

        //fdTaskCpSrc
        let fdTaskCpSrc = `./${tag}_taskCpSrc`
        w.fsCleanFolder(fdTaskCpSrc)

        //funDownload, 下載數據為114115與114116
        let eqsDownload = [eq114115, eq114116]
        let funDownload = async() => {
            _.each(eqsDownload, (v) => {
                fs.writeFileSync(`${fdDwAttime}/${v.id}.json`, JSON.stringify(v), 'utf8')
            })
            return eqsDownload
        }

        //funRemove, funAdd, funModify, 覆寫為不處理(不下載圖檔)
        let funRemove = async() => {}
        let funAdd = async() => {}
        let funModify = async() => {}

        //readFileSync之替身, 記錄fdDwCurrent之下被讀取之相對路徑
        let fdAbs = path.resolve(fdDwCurrent)
        let readOri = fs.readFileSync
        let reads = []
        let m = mock.method(fs, 'readFileSync', function(p, ...args) {
            if (typeof p === 'string') {
                let rel = path.relative(fdAbs, path.resolve(p))
                if (rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)) {
                    reads.push(rel.replace(/\\/g, '/'))
                    if (fs.statSync(p).isDirectory()) {
                        return JSON.stringify({ id: 'stub-folder' }) //資料夾項目於真實檔案系統不可讀, 回傳固定JSON使讀取不中斷
                    }
                }
            }
            return readOri.call(this, p, ...args)
        })

        let msChange = []
        try {
            let pm = w.genPm()
            let ev = await WDwdataTweq('2022-01-01', '2022-12-31', {
                fdTagRemove,
                fdDwAttime,
                fdDwCurrent,
                fdResult,
                fdTaskCpActualSrc,
                fdTaskCpSrc,
                useShowLog: false,
                funDownload,
                funRemove,
                funAdd,
                funModify,
            })
            ev.on('change', (msg) => {
                msChange.push({ ...msg })
            })
            ev.on('end', () => {
                pm.resolve()
            })
            await pm
        }
        finally {
            m.mock.restore()
            w.fsDeleteFolder(fdTagRemove)
            w.fsDeleteFolder(fdDwAttime)
            w.fsDeleteFolder(fdDwCurrent)
            w.fsDeleteFolder(fdResult)
            w.fsDeleteFolder(fdTaskCpActualSrc)
            w.fsDeleteFolder(fdTaskCpSrc)
        }

        //numGetCurrent, funGetCurrent交出之項目數
        let numGetCurrent = _.get(_.find(msChange, (v) => v.event === 'proc-callfun-getCurrent' && v.msg === 'done'), 'num')

        //spec: 只列第1層(檔案114115.json與資料夾stray), 第2層之stray/ghost.json不得被列入
        assert.strict.deepEqual({
            reads: _.uniq(reads).sort(),
            numGetCurrent,
        }, {
            reads: [`${eq114115.id}.json`, 'stray'],
            numGetCurrent: 2,
        })
    })

})
