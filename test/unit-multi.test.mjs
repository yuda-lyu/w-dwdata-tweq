import fs from 'fs'
import _ from 'lodash-es'
import w from 'wsemi'
import assert from 'assert'
import WDwdataTweq from '../src/WDwdataTweq.mjs'
import fakeWebServer from './lib/fakeWebServer.mjs'
import genEq, { eq114115, eq114116, eq114116m } from './lib/genEqs.mjs'


describe('multi', function() {

    let test = async() => {

        let ms = []

        //tag
        let tag = `_multi`

        //srv, 假HTTP伺服器, 供funAdd與funModify下載地震圖檔, port給0由系統指派, 避免平行測試時衝突
        let srv = await fakeWebServer()

        //kpEqs, 各輪次之下載數據, 第1輪新增114115, 第2輪新增114116, 第3輪更新114116
        let kpEqs = {
            1: [
                genEq(srv.urlBase, eq114115),
            ],
            2: [
                genEq(srv.urlBase, eq114115),
                genEq(srv.urlBase, eq114116),
            ],
            3: [
                genEq(srv.urlBase, eq114115),
                genEq(srv.urlBase, eq114116m),
            ],
        }

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

        //fnssResult, 各輪次結束時fdResult內之地震資料夾與其檔案
        let fnssResult = []

        let i = 0
        let run = async() => {
            i++

            let pm = w.genPm()

            //funDownload
            let funDownload = async() => {
                w.fsCleanFolder(fdDwAttime)
                let eqs = kpEqs[i]
                _.each(eqs, (v) => {
                    let fp = `${fdDwAttime}/${v.id}.json`
                    fs.writeFileSync(fp, JSON.stringify(v), 'utf8')
                })
                return eqs
            }

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
                if (w.arrHas(msg.event, [
                    'start',
                    'proc-callfun-download',
                    'proc-callfun-getCurrent',
                    'proc-callfun-afterStart',
                    'proc-callfun-beforeEnd',
                ])) {
                    return
                }
                // console.log('change', msg)
                ms.push(msg)
            })
            ev.on('end', () => {

                //fnsResult
                let fnsResult = {}
                _.each(fs.readdirSync(fdResult).sort(), (id) => {
                    fnsResult[id] = fs.readdirSync(`${fdResult}/${id}`).sort()
                })
                fnssResult.push(fnsResult)

                pm.resolve()
            })

            return pm
        }
        await w.pmSeries(kpEqs, async() => {
            await run()
        })

        w.fsDeleteFolder(fdTagRemove)
        w.fsDeleteFolder(fdDwAttime)
        w.fsDeleteFolder(fdDwCurrent)
        w.fsDeleteFolder(fdResult)
        w.fsDeleteFolder(fdTaskCpActualSrc)
        w.fsDeleteFolder(fdTaskCpSrc)

        await srv.close()

        // console.log('ms', ms)
        return { ms, fnssResult }
    }

    //rTest, 各測試共用同一次執行結果
    let rTest = null
    before(async function() {
        this.timeout(60000)
        rTest = await test()
    })

    //ms, 各輪次所發送之change事件, 已濾除各輪次皆相同之啟動與下載階段事件
    let ms = [
        { event: 'proc-compare', msg: 'start...' },
        {
            event: 'proc-compare',
            numRemove: 0,
            numAdd: 1,
            numModify: 0,
            numSame: 0,
            msg: 'done'
        },
        { event: 'proc-add-callfun-add', id: '114115', msg: 'start...' },
        { event: 'proc-add-callfun-add', id: '114115', msg: 'done' },
        { event: 'end', msg: 'done' },
        { event: 'proc-compare', msg: 'start...' },
        {
            event: 'proc-compare',
            numRemove: 0,
            numAdd: 1,
            numModify: 0,
            numSame: 1,
            msg: 'done'
        },
        { event: 'proc-add-callfun-add', id: '114116', msg: 'start...' },
        { event: 'proc-add-callfun-add', id: '114116', msg: 'done' },
        { event: 'end', msg: 'done' },
        { event: 'proc-compare', msg: 'start...' },
        {
            event: 'proc-compare',
            numRemove: 0,
            numAdd: 0,
            numModify: 1,
            numSame: 1,
            msg: 'done'
        },
        { event: 'proc-diff-callfun-modify', id: '114116', msg: 'start...' },
        { event: 'proc-diff-callfun-modify', id: '114116', msg: 'done' },
        { event: 'end', msg: 'done' }
    ]

    //fns, 各地震資料夾內之4張下載圖檔與1張裁切圖檔
    let fns = [
        'picEqIntensity.png',
        'picEqIntensityList.gif',
        'picEqPga.png',
        'picEqPgv.png',
        'picEqReport.gif',
    ]

    it('test multi: 連續3輪之新增、新增與更新之change事件', async () => {
        let r = rTest.ms
        let rr = ms
        assert.strict.deepEqual(r, rr)
    })

    it('test multi: 各輪次結束時fdResult之地震資料夾與其檔案', async () => {
        let r = rTest.fnssResult
        let rr = [
            { '114115': fns },
            { '114115': fns, '114116': fns },
            { '114115': fns, '114116': fns },
        ]
        assert.strict.deepEqual(r, rr)
    })

})
