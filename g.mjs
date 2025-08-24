// import path from 'path'
// import fs from 'fs'
// import _ from 'lodash-es'
import w from 'wsemi'
import WDwdataTweq from './src/WDwdataTweq.mjs'


//fdDwAttime
let fdDwAttime = `./_dwAttime`
w.fsCleanFolder(fdDwAttime)

//fdDwCurrent
let fdDwCurrent = `./_dwCurrent`
w.fsCleanFolder(fdDwCurrent)

//fdResult
let fdResult = `./_result`
w.fsCleanFolder(fdResult)

let yearStart = 2022
let yearEnd = 2022
let opt = {
    fdDwAttime,
    fdDwCurrent,
    fdResult,
    // funDownload,
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
    console.log('change', msg)
})
// change { event: 'start', msg: 'running...' }
// change { event: 'proc-callfun-download', msg: 'start...' }
// change { event: 'proc-callfun-download', msg: 'done' }
// change { event: 'proc-callfun-getCurrent', msg: 'start...' }
// change { event: 'proc-callfun-getCurrent', msg: 'done' }
// change { event: 'compare', msg: 'start...' }
// change { event: 'compare', msg: 'done' }
// change { event: 'proc-add-callfun-add', id: '111001', msg: 'start...' }
// change { event: 'proc-add-callfun-add', id: '111001', msg: 'done' }
// change { event: 'proc-add-callfun-add', id: '111002', msg: 'start...' }
// change { event: 'proc-add-callfun-add', id: '111002', msg: 'done' }
// ...


//node g.mjs
