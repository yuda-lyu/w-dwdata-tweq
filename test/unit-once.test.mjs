import fs from 'fs'
import _ from 'lodash-es'
import w from 'wsemi'
import sharp from 'sharp'
import assert from 'assert'
import WDwdataTweq from '../src/WDwdataTweq.mjs'
import fakeWebServer from './lib/fakeWebServer.mjs'
import genEq, { eq114115, eq114116 } from './lib/genEqs.mjs'


describe('once', function() {

    let test = async() => {

        let ms = []

        //tag
        let tag = `_once`

        //srv, 假HTTP伺服器, 供funAdd下載地震圖檔, port給0由系統指派, 避免平行測試時衝突
        let srv = await fakeWebServer()

        //fdTagRemove
        let fdTagRemove = `./${tag}_tagRemove`
        w.fsCleanFolder(fdTagRemove)

        //fdDwAttime
        let fdDwAttime = `./${tag}_dwAttime`
        w.fsCleanFolder(fdDwAttime)

        //fdDwCurrent
        let fdDwCurrent = `./${tag}_dwCurrent`
        w.fsCleanFolder(fdDwCurrent)

        //fdResult
        let fdResult = `./${tag}_result`
        w.fsCleanFolder(fdResult)

        //fdTaskCpActualSrc
        let fdTaskCpActualSrc = `./${tag}_taskCpActualSrc`
        w.fsCleanFolder(fdTaskCpActualSrc)

        //fdTaskCpSrc
        let fdTaskCpSrc = `./${tag}_taskCpSrc`
        w.fsCleanFolder(fdTaskCpSrc)

        //eqs, 圖檔網址指向假伺服器
        let eqs = [
            genEq(srv.urlBase, eq114115),
            genEq(srv.urlBase, eq114116),
        ]

        //funDownload
        let funDownload = async() => {

            _.each(eqs, (v) => {

                let fp = `${fdDwAttime}/${v.id}.json`

                fs.writeFileSync(fp, JSON.stringify(v), 'utf8')

            })

            return eqs
        }

        let pm = w.genPm()

        let yearStart = 2022
        let yearEnd = 2022
        let opt = {
            fdTagRemove,
            fdDwAttime,
            fdDwCurrent,
            fdResult,
            fdTaskCpActualSrc,
            fdTaskCpSrc,
            // srLog,
            // useShowLog,
            funDownload,
            // funGetCurrent,
            // funRemove,
            // funAdd,
            // funModify,
        }
        let ev = await WDwdataTweq(yearStart, yearEnd, opt)
            .catch((err) => {
                console.log(err)
            })
        ev.on('change', (msg) => {
            delete msg.type
            delete msg.timeRunStart
            delete msg.timeRunEnd
            delete msg.timeRunSpent
            // console.log('change', msg)
            ms.push(msg)
        })
        ev.on('end', () => {

            //fnsResult, funAdd於fdResult內各地震資料夾所產生之檔案
            let fnsResult = {}
            _.each(eqs, (v) => {
                fnsResult[v.id] = fs.readdirSync(`${fdResult}/${v.id}`).sort()
            })

            //buffCrop, cropPic自picEqReport.gif裁切之結果
            let buffCrop = fs.readFileSync(`${fdResult}/${eqs[0].id}/picEqIntensityList.gif`)

            //fnsDwCurrent, 結束前fdDwAttime已完全同步至fdDwCurrent
            let fnsDwCurrent = fs.readdirSync(fdDwCurrent).sort()

            pm.resolve({ ms, fnsResult, buffCrop, fnsDwCurrent })
        })

        let r = await pm

        //metaCrop, 裁切後圖檔之尺寸
        r.metaCrop = await sharp(r.buffCrop).metadata()
        delete r.buffCrop

        w.fsDeleteFolder(fdTagRemove)
        w.fsDeleteFolder(fdDwAttime)
        w.fsDeleteFolder(fdDwCurrent)
        w.fsDeleteFolder(fdResult)
        w.fsDeleteFolder(fdTaskCpActualSrc)
        w.fsDeleteFolder(fdTaskCpSrc)

        await srv.close()

        // console.log('r', r)
        return r
    }

    //rTest, 各測試共用同一次執行結果
    let rTest = null
    before(async function() {
        this.timeout(60000)
        rTest = await test()
    })

    //ms, 各階段所發送之change事件
    let ms = [
        { event: 'start', msg: 'running...' },
        { event: 'proc-callfun-afterStart', msg: 'start...' },
        { event: 'proc-callfun-afterStart', msg: 'done' },
        { event: 'proc-callfun-download', msg: 'start...' },
        { event: 'proc-callfun-download', num: 2, msg: 'done' },
        { event: 'proc-callfun-getCurrent', msg: 'start...' },
        { event: 'proc-callfun-getCurrent', num: 0, msg: 'done' },
        { event: 'proc-compare', msg: 'start...' },
        {
            event: 'proc-compare',
            numRemove: 0,
            numAdd: 2,
            numModify: 0,
            numSame: 0,
            msg: 'done'
        },
        { event: 'proc-add-callfun-add', id: '114115', msg: 'start...' },
        { event: 'proc-add-callfun-add', id: '114115', msg: 'done' },
        { event: 'proc-add-callfun-add', id: '114116', msg: 'start...' },
        { event: 'proc-add-callfun-add', id: '114116', msg: 'done' },
        { event: 'proc-callfun-beforeEnd', msg: 'start...' },
        { event: 'proc-callfun-beforeEnd', msg: 'done' },
        { event: 'end', msg: 'done' }
    ]

    it('test once: 全為新增時之change事件', async () => {
        let r = rTest.ms
        let rr = ms
        assert.strict.deepEqual(r, rr)
    })

    it('test once: funAdd於各地震資料夾產生4張下載圖檔與1張裁切圖檔', async () => {
        let r = rTest.fnsResult
        let fns = [
            'picEqIntensity.png',
            'picEqIntensityList.gif',
            'picEqPga.png',
            'picEqPgv.png',
            'picEqReport.gif',
        ]
        let rr = {
            '114115': fns,
            '114116': fns,
        }
        assert.strict.deepEqual(r, rr)
    })

    it('test once: picEqIntensityList.gif為picEqReport.gif裁切276x204之結果', async () => {
        let r = { format: rTest.metaCrop.format, width: rTest.metaCrop.width, height: rTest.metaCrop.height }
        let rr = { format: 'gif', width: 276, height: 204 }
        assert.strict.deepEqual(r, rr)
    })

    it('test once: 結束前fdDwAttime已同步至fdDwCurrent', async () => {
        let r = rTest.fnsDwCurrent
        let rr = ['114115.json', '114116.json']
        assert.strict.deepEqual(r, rr)
    })

})
