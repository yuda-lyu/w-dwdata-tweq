import fs from 'fs'
import _ from 'lodash-es'
import w from 'wsemi'
import assert from 'assert'
import WDwdataTweq from '../src/WDwdataTweq.mjs'


describe('once', function() {

    let test = async() => {

        let pm = w.genPm()

        let ms = []

        //fdDwAttime
        let fdDwAttime = `./_once_dwAttime`
        w.fsCleanFolder(fdDwAttime)

        //fdDwCurrent
        let fdDwCurrent = `./_once_dwCurrent`
        w.fsCleanFolder(fdDwCurrent)

        //fdResult
        let fdResult = `./_once_result`
        w.fsCleanFolder(fdResult)

        //funDownload
        let funDownload = async() => {

            //reverse
            let eqs = [
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

            _.each(eqs, (v) => {

                let fp = `${fdDwAttime}/${v.id}.json`

                fs.writeFileSync(fp, JSON.stringify(v), 'utf8')

            })

            return eqs
        }

        let yearStart = 2022
        let yearEnd = 2022
        let opt = {
            fdDwAttime,
            fdDwCurrent,
            fdResult,
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
            w.fsDeleteFolder(fdDwAttime)
            w.fsDeleteFolder(fdDwCurrent)
            w.fsDeleteFolder(fdResult)
            // console.log('ms', ms)
            pm.resolve(ms)
        })

        return pm
    }
    let ms = [
        { event: 'start', msg: 'running...' },
        { event: 'proc-callfun-afterStart', msg: 'start...' },
        { event: 'proc-callfun-afterStart', msg: 'done' },
        { event: 'proc-callfun-download', msg: 'start...' },
        { event: 'proc-callfun-download', num: 2, msg: 'done' },
        { event: 'proc-callfun-getCurrent', msg: 'start...' },
        { event: 'proc-callfun-getCurrent', num: 0, msg: 'done' },
        { event: 'compare', msg: 'start...' },
        {
            event: 'compare',
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

    it('test once', async () => {
        let r = await test()
        let rr = ms
        assert.strict.deepEqual(r, rr)
    })

})
