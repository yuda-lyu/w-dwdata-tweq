import fs from 'fs'
import get from 'lodash-es/get.js'
import each from 'lodash-es/each.js'
import reverse from 'lodash-es/reverse.js'
import isestr from 'wsemi/src/isestr.mjs'
import isnum from 'wsemi/src/isnum.mjs'
import isp0int from 'wsemi/src/isp0int.mjs'
import isfun from 'wsemi/src/isfun.mjs'
import cdbl from 'wsemi/src/cdbl.mjs'
import cint from 'wsemi/src/cint.mjs'
import fsIsFolder from 'wsemi/src/fsIsFolder.mjs'
import fsCleanFolder from 'wsemi/src/fsCleanFolder.mjs'
import fsCreateFolder from 'wsemi/src/fsCreateFolder.mjs'
import fsDeleteFolder from 'wsemi/src/fsDeleteFolder.mjs'
import fsTreeFolder from 'wsemi/src/fsTreeFolder.mjs'
import WDwdataBuilder from 'w-dwdata-builder/src/WDwdataBuilder.mjs'
import downloadEqs from './downloadEqs.mjs'
import parseData from './parseData.mjs'
import downloadPics from './downloadPics.mjs'
import cropPic from './cropPic.mjs'


/**
 * 基於檔案之下載台灣氣象署地震數據與任務建構器
 *
 * 因各檔案小，真實數據直接視為hash數據做差異比對
 *
 * 執行階段最新數據放置於fdDwAttime，前次數據會於結束前自動備份至fdDwCurrent
 *
 * @param {Integer} yearStart 輸入數據開始年整數
 * @param {Integer} yearEnd 輸入數據結束年整數
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {String} [opt.keyId='keyId'] 輸入各筆數據之主鍵字串，預設'keyId'
 * @param {String} [opt.fdTagRemove='./_tagRemove'] 輸入暫存標記為刪除數據資料夾字串，預設'./_tagRemove'
 * @param {String} [opt.fdDwAttime='./_dwAttime'] 輸入當前下載數據資料夾字串，預設'./_dwAttime'
 * @param {String} [opt.fdDwCurrent='./_dwCurrent'] 輸入已下載數據資料夾字串，預設'./_dwCurrent'
 * @param {String} [opt.fdResult='./_result'] 輸入已下載數據所連動生成數據資料夾字串，預設'./_result'
 * @param {String} [opt.fdTaskCpActualSrc='./_taskCpActualSrc'] 輸入任務狀態之來源端完整資料夾字串，預設'./_taskCpActualSrc'
 * @param {String} [opt.fdTaskCpSrc='./_taskCpSrc'] 輸入任務狀態之來源端資料夾字串，預設'./_taskCpSrc'
 * @param {String} [opt.fdLog='./_logs'] 輸入儲存log資料夾字串，預設'./_logs'
 * @param {Function} [opt.funDownload=null] 輸入取得當前下載數據之函數，回傳資料陣列，預設null
 * @param {Function} [opt.funGetCurrent=null] 輸入取得已下載數據之函數，回傳資料陣列，預設null
 * @param {Function} [opt.funAdd=null] 輸入當有新資料時，需要連動處理之函數，預設null
 * @param {Function} [opt.funModify=null] 輸入當有資料需更新時，需要連動處理之函數，預設null
 * @param {Function} [opt.funRemove=null] 輸入當有資料需刪除時，需要連動處理之函數，預設null
 * @param {Number} [opt.timeToleranceRemove=0] 輸入刪除任務之防抖時長，單位ms，預設0，代表不使用
 * @returns {Object} 回傳事件物件，可呼叫函數on監聽change事件
 * @example
 *
 * import w from 'wsemi'
 * import WDwdataTweq from './src/WDwdataTweq.mjs'
 *
 * //fdTagRemove
 * let fdTagRemove = `./_tagRemove`
 * w.fsCleanFolder(fdTagRemove)
 *
 * //fdDwAttime
 * let fdDwAttime = `./_dwAttime`
 * w.fsCleanFolder(fdDwAttime)
 *
 * //fdDwCurrent
 * let fdDwCurrent = `./_dwCurrent`
 * w.fsCleanFolder(fdDwCurrent)
 *
 * //fdResult
 * let fdResult = `./_result`
 * w.fsCleanFolder(fdResult)
 *
 * //fdTaskCpActualSrc
 * let fdTaskCpActualSrc = `./_taskCpActualSrc`
 * w.fsCleanFolder(fdTaskCpActualSrc)
 *
 * //fdTaskCpSrc
 * let fdTaskCpSrc = `./_taskCpSrc`
 * w.fsCleanFolder(fdTaskCpSrc)
 *
 * let yearStart = 2022
 * let yearEnd = 2022
 * let opt = {
 *     fdTagRemove,
 *     fdDwAttime,
 *     fdDwCurrent,
 *     fdResult,
 *     fdTaskCpActualSrc,
 *     fdTaskCpSrc,
 *     // fdLog,
 *     // funDownload,
 *     // funGetCurrent,
 *     // funRemove,
 *     // funAdd,
 *     // funModify,
 * }
 * let ev = await WDwdataTweq(yearStart, yearEnd, opt)
 *     .catch((err) => {
 *         console.log(err)
 *     })
 * ev.on('change', (msg) => {
 *     delete msg.type
 *     console.log('change', msg)
 * })
 * // change { event: 'start', msg: 'running...' }
 * // change { event: 'proc-callfun-afterStart', msg: 'start...' }
 * // change { event: 'proc-callfun-afterStart', msg: 'done' }
 * // change { event: 'proc-callfun-download', msg: 'start...' }
 * // change { event: 'proc-callfun-download', num: 2, msg: 'done' }
 * // change { event: 'proc-callfun-getCurrent', msg: 'start...' }
 * // change { event: 'proc-callfun-getCurrent', num: 0, msg: 'done' }
 * // change { event: 'compare', msg: 'start...' }
 * // change { event: 'compare', numRemove: 0, numAdd: 2, numModify: 0, numSame: 0, msg: 'done' }
 * // change { event: 'proc-add-callfun-add', id: '111001', msg: 'start...' }
 * // change { event: 'proc-add-callfun-add', id: '111001', msg: 'done' }
 * // change { event: 'proc-add-callfun-add', id: '111002', msg: 'start...' }
 * // change { event: 'proc-add-callfun-add', id: '111002', msg: 'done' }
 * // ...
 *
 */
let WDwdataTweq = async(yearStart, yearEnd, opt = {}) => {

    //check yearStart
    if (!isnum(yearStart)) {
        throw new Error(`yearStart is not a number`)
    }
    yearStart = cint(yearStart)

    //check yearEnd
    if (!isnum(yearEnd)) {
        throw new Error(`yearEnd is not a number`)
    }
    yearEnd = cint(yearEnd)

    //keyId
    let keyId = get(opt, 'keyId')
    if (!isestr(keyId)) {
        keyId = `id`
    }

    //fdTagRemove, 暫存標記為刪除數據資料夾
    let fdTagRemove = get(opt, 'fdTagRemove')
    if (!isestr(fdTagRemove)) {
        fdTagRemove = `./_tagRemove`
    }

    //fdDwAttime
    let fdDwAttime = get(opt, 'fdDwAttime')
    if (!isestr(fdDwAttime)) {
        fdDwAttime = `./_dwAttime`
    }
    if (!fsIsFolder(fdDwAttime)) {
        fsCreateFolder(fdDwAttime)
    }

    //fdDwCurrent
    let fdDwCurrent = get(opt, 'fdDwCurrent')
    if (!isestr(fdDwCurrent)) {
        fdDwCurrent = `./_dwCurrent`
    }
    if (!fsIsFolder(fdDwCurrent)) {
        fsCreateFolder(fdDwCurrent)
    }

    //fdResult
    let fdResult = get(opt, 'fdResult')
    if (!isestr(fdResult)) {
        fdResult = `./_result`
    }
    if (!fsIsFolder(fdResult)) {
        fsCreateFolder(fdResult)
    }

    //fdTaskCpActualSrc, 儲存完整任務狀態資料夾
    let fdTaskCpActualSrc = get(opt, 'fdTaskCpActualSrc')
    if (!isestr(fdTaskCpActualSrc)) {
        fdTaskCpActualSrc = `./_taskCpActualSrc`
    }
    if (!fsIsFolder(fdTaskCpActualSrc)) {
        fsCreateFolder(fdTaskCpActualSrc)
    }

    //fdTaskCpSrc
    let fdTaskCpSrc = get(opt, 'fdTaskCpSrc')
    if (!isestr(fdTaskCpSrc)) {
        fdTaskCpSrc = './_taskCpSrc'
    }
    if (!fsIsFolder(fdTaskCpSrc)) {
        fsCreateFolder(fdTaskCpSrc)
    }

    //fdLog
    let fdLog = get(opt, 'fdLog')
    if (!isestr(fdLog)) {
        fdLog = './_logs'
    }
    if (!fsIsFolder(fdLog)) {
        fsCreateFolder(fdLog)
    }

    //funDownload
    let funDownload = get(opt, 'funDownload')

    //funGetCurrent
    let funGetCurrent = get(opt, 'funGetCurrent')

    //funAdd
    let funAdd = get(opt, 'funAdd')

    //funModify
    let funModify = get(opt, 'funModify')

    //funRemove
    let funRemove = get(opt, 'funRemove')

    //timeToleranceRemove
    let timeToleranceRemove = get(opt, 'timeToleranceRemove')
    if (!isp0int(timeToleranceRemove)) {
        timeToleranceRemove = 0
    }
    timeToleranceRemove = cdbl(timeToleranceRemove)

    //funDownloadDef
    let funDownloadDef = async() => {

        //downloadEqs
        let v = await downloadEqs(yearStart, yearEnd)
        // console.log('downloadEqs', v)

        //parseData
        let eqs = parseData(v)
        // console.log('eqsAtt', eqsAtt, size(eqsAtt))

        //reverse
        eqs = reverse(eqs)

        each(eqs, (v) => {

            let fp = `${fdDwAttime}/${v[keyId]}.json`

            fs.writeFileSync(fp, JSON.stringify(v), 'utf8')

        })

        return eqs
    }
    if (!isfun(funDownload)) {
        funDownload = funDownloadDef
    }

    //funGetCurrentDef
    let funGetCurrentDef = async() => {

        //vfps
        let vfps = fsTreeFolder(fdDwCurrent, 1)
        // console.log('vfps', vfps)

        //eqs
        let eqs = []
        each(vfps, (v) => {

            let j = fs.readFileSync(v.path, 'utf8')
            let eq = JSON.parse(j)

            eqs.push(eq)

        })

        return eqs
    }
    if (!isfun(funGetCurrent)) {
        funGetCurrent = funGetCurrentDef
    }

    //funRemoveDef
    let funRemoveDef = async(v) => {

        let fd = `${fdResult}/${v[keyId]}`
        if (fsIsFolder(fd)) {
            fsDeleteFolder(fd)
        }

    }
    if (!isfun(funRemove)) {
        funRemove = funRemoveDef
    }

    //downloadAndCropPics
    let downloadAndCropPics = async(fd, v) => {

        await downloadPics(fd, v)

        let fnIn = 'picEqReport.gif'
        let fpIn = `${fd}/${fnIn}`
        let fnOut = 'picEqIntensityList.gif'
        let fpOut = `${fd}/${fnOut}`
        await cropPic(fpIn, fpOut, 364, 199, 276, 204)

    }

    //funAddDef
    let funAddDef = async(v) => {

        let fd = `${fdResult}/${v[keyId]}`
        if (!fsIsFolder(fd)) {
            fsCreateFolder(fd)
        }
        fsCleanFolder(fd)

        await downloadAndCropPics(fd, v)

    }
    if (!isfun(funAdd)) {
        funAdd = funAddDef
    }

    //funModifyDef
    let funModifyDef = async(v) => {

        let fd = `${fdResult}/${v[keyId]}`
        if (!fsIsFolder(fd)) {
            fsCreateFolder(fd)
        }
        fsCleanFolder(fd)

        await downloadAndCropPics(fd, v)

    }
    if (!isfun(funModify)) {
        funModify = funModifyDef
    }

    let optBdr = {
        fdTagRemove,
        fdDwAttime,
        fdDwCurrent,
        // fdResult, //WDwdataBuilder不需要
        fdTaskCpActualSrc,
        fdTaskCpSrc,
        fdLog,
        funDownload,
        funGetCurrent,
        funRemove,
        funAdd,
        funModify,
        timeToleranceRemove,
    }
    let ev = await WDwdataBuilder(optBdr)

    return ev
}


export default WDwdataTweq
