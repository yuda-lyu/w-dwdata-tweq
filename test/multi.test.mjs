import fs from 'fs'
import _ from 'lodash-es'
import w from 'wsemi'
import assert from 'assert'
import WDwdataTweq from '../src/WDwdataTweq.mjs'


describe('multi', function() {

    let test = async() => {
        let ms = []

        let eqs1 = [
            {
                'id': '114115',
                'tag': '2025082116374751115',
                'number': '115',
                'time': '2025-08-21T16:37:47+08:00',
                'timeRec': '2025-08-21 16:37:47',
                'timeTag': '20250821163747',
                'ml': '5.1',
                'urlWebEqInfor': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Details/2025082116374751115',
                'urlWebEqReport': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Imgs/2025082116374751115',
                'urlWebEqIntensity': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/ShakeMap/2025082116374751115',
                'urlWebEqWave': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/WaveformAcc/2025082116374751115',
                'urlPicEqReport': 'https://scweb.cwa.gov.tw/webdata/OLDEQ/202508/2025082116374751115.gif',
                'urlPicEqIntensity': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025115i.png',
                'urlPicEqPga': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025115a.png',
                'urlPicEqPgv': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025115v.png',
            },
        ]
        let eqs2 = [ //add 114116
            {
                'id': '114115',
                'tag': '2025082116374751115',
                'number': '115',
                'time': '2025-08-21T16:37:47+08:00',
                'timeRec': '2025-08-21 16:37:47',
                'timeTag': '20250821163747',
                'ml': '5.1',
                'urlWebEqInfor': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Details/2025082116374751115',
                'urlWebEqReport': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Imgs/2025082116374751115',
                'urlWebEqIntensity': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/ShakeMap/2025082116374751115',
                'urlWebEqWave': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/WaveformAcc/2025082116374751115',
                'urlPicEqReport': 'https://scweb.cwa.gov.tw/webdata/OLDEQ/202508/2025082116374751115.gif',
                'urlPicEqIntensity': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025115i.png',
                'urlPicEqPga': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025115a.png',
                'urlPicEqPgv': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025115v.png',
            },
            {
                'id': '114116',
                'tag': '2025082214061554116',
                'number': '116',
                'time': '2025-08-22T14:06:15+08:00',
                'timeRec': '2025-08-22 14:06:15',
                'timeTag': '20250822140615',
                'ml': '5.4',
                'urlWebEqInfor': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Details/2025082214061554116',
                'urlWebEqReport': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Imgs/2025082214061554116',
                'urlWebEqIntensity': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/ShakeMap/2025082214061554116',
                'urlWebEqWave': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/WaveformAcc/2025082214061554116',
                'urlPicEqReport': 'https://scweb.cwa.gov.tw/webdata/OLDEQ/202508/2025082214061554116.gif',
                'urlPicEqIntensity': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025116i.png',
                'urlPicEqPga': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025116a.png',
                'urlPicEqPgv': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025116v.png',
            },
        ]
        let eqs3 = [ //modify 114116
            {
                'id': '114115',
                'tag': '2025082116374751115',
                'number': '115',
                'time': '2025-08-21T16:37:47+08:00',
                'timeRec': '2025-08-21 16:37:47',
                'timeTag': '20250821163747',
                'ml': '5.1',
                'urlWebEqInfor': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Details/2025082116374751115',
                'urlWebEqReport': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Imgs/2025082116374751115',
                'urlWebEqIntensity': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/ShakeMap/2025082116374751115',
                'urlWebEqWave': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/WaveformAcc/2025082116374751115',
                'urlPicEqReport': 'https://scweb.cwa.gov.tw/webdata/OLDEQ/202508/2025082116374751115.gif',
                'urlPicEqIntensity': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025115i.png',
                'urlPicEqPga': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025115a.png',
                'urlPicEqPgv': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025115v.png',
            },
            {
                'id': '114116',
                'tag': '2025082214061554116',
                'number': '116',
                'time': '2025-08-22T14:06:15+08:00',
                'timeRec': '2025-08-22 14:06:15',
                'timeTag': '20250822140615',
                'ml': '5.6',
                'urlWebEqInfor': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Details/2025082214061554116',
                'urlWebEqReport': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Imgs/2025082214061554116',
                'urlWebEqIntensity': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/ShakeMap/2025082214061554116',
                'urlWebEqWave': 'https://scweb.cwa.gov.tw/zh-TW/earthquake/WaveformAcc/2025082214061554116',
                'urlPicEqReport': 'https://scweb.cwa.gov.tw/webdata/OLDEQ/202508/2025082214061554116.gif',
                'urlPicEqIntensity': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025116i.png',
                'urlPicEqPga': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025116a.png',
                'urlPicEqPgv': 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025116v.png',
            },
        ]
        let kpEqs = {
            1: eqs1,
            2: eqs2,
            3: eqs3,
        }

        //fdTagRemove
        let fdTagRemove = `./_multi_tagRemove`
        w.fsCleanFolder(fdTagRemove)

        //fdDwAttime
        let fdDwAttime = `./_multi_dwAttime`
        w.fsCleanFolder(fdDwAttime)

        //fdDwCurrent
        let fdDwCurrent = `./_multi_dwCurrent`
        w.fsCleanFolder(fdDwCurrent)

        //fdResult
        let fdResult = `./_multi_result`
        w.fsCleanFolder(fdResult)

        //fdTaskCpActualSrc
        let fdTaskCpActualSrc = `./_multi_taskCpActualSrc`
        w.fsCleanFolder(fdTaskCpActualSrc)

        //fdTaskCpSrc
        let fdTaskCpSrc = `./_multi_taskCpSrc`
        w.fsCleanFolder(fdTaskCpSrc)

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
                // fdLog,
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

        // console.log('ms', ms)
        return ms
    }
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

    it('test multi', async () => {
        let r = await test()
        let rr = ms
        assert.strict.deepEqual(r, rr)
    })

})
