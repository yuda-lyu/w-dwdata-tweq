# w-dwdata-tweq
A downloader for earthquake data from Taiwan CWA.

![language](https://img.shields.io/badge/language-JavaScript-orange.svg) 
[![npm version](http://img.shields.io/npm/v/w-dwdata-tweq.svg?style=flat)](https://npmjs.org/package/w-dwdata-tweq) 
[![license](https://img.shields.io/npm/l/w-dwdata-tweq.svg?style=flat)](https://npmjs.org/package/w-dwdata-tweq) 
[![npm download](https://img.shields.io/npm/dt/w-dwdata-tweq.svg)](https://npmjs.org/package/w-dwdata-tweq) 
[![npm download](https://img.shields.io/npm/dm/w-dwdata-tweq.svg)](https://npmjs.org/package/w-dwdata-tweq) 
[![jsdelivr download](https://img.shields.io/jsdelivr/npm/hm/w-dwdata-tweq.svg)](https://www.jsdelivr.com/package/npm/w-dwdata-tweq)

## Documentation
To view documentation or get support, visit [docs](https://yuda-lyu.github.io/w-dwdata-tweq/global.html).

## Installation

### Using npm(ES6 module):
```alias
npm i w-dwdata-tweq
```

#### Example:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-dwdata-tweq/blob/master/g.mjs)]
```alias
import w from 'wsemi'
import WDwdataTweq from './src/WDwdataTweq.mjs'

//fdTagRemove
let fdTagRemove = `./_tagRemove`
w.fsCleanFolder(fdTagRemove)

//fdDwAttime
let fdDwAttime = `./_dwAttime`
w.fsCleanFolder(fdDwAttime)

//fdDwCurrent
let fdDwCurrent = `./_dwCurrent`
w.fsCleanFolder(fdDwCurrent)

//fdResult
let fdResult = `./_result`
w.fsCleanFolder(fdResult)

//fdTaskCpActualSrc
let fdTaskCpActualSrc = `./_taskCpActualSrc`
w.fsCleanFolder(fdTaskCpActualSrc)

//fdTaskCpSrc
let fdTaskCpSrc = `./_taskCpSrc`
w.fsCleanFolder(fdTaskCpSrc)

let dayStart = '2022-01-01'
let dayEnd = '2022-12-31'
let opt = {
    fdTagRemove,
    fdDwAttime,
    fdDwCurrent,
    fdResult,
    fdTaskCpActualSrc,
    fdTaskCpSrc,
    // srLog,
    // useShowLog,
    // funDownload,
    // funGetCurrent,
    // funRemove,
    // funAdd,
    // funModify,
}
let ev = await WDwdataTweq(dayStart, dayEnd, opt)
    .catch((err) => {
        console.log(err)
    })
ev.on('change', (msg) => {
    delete msg.type
    console.log('change', msg)
})
// change { event: 'start', msg: 'running...' }
// change { event: 'proc-callfun-afterStart', msg: 'start...' }
// change { event: 'proc-callfun-afterStart', msg: 'done' }
// change { event: 'proc-callfun-download', msg: 'start...' }
// change { event: 'proc-callfun-download', num: 2, msg: 'done' }
// change { event: 'proc-callfun-getCurrent', msg: 'start...' }
// change { event: 'proc-callfun-getCurrent', num: 0, msg: 'done' }
// change { event: 'proc-compare', msg: 'start...' }
// change { event: 'proc-compare', numRemove: 0, numAdd: 2, numModify: 0, numSame: 0, msg: 'done' }
// change { event: 'proc-add-callfun-add', id: '111001', msg: 'start...' }
// change { event: 'proc-add-callfun-add', id: '111001', msg: 'done' }
// change { event: 'proc-add-callfun-add', id: '111002', msg: 'start...' }
// change { event: 'proc-add-callfun-add', id: '111002', msg: 'done' }
// ...
```

## Breaking changes

### One failing item no longer cancels the round; only successful items go into `fdDwCurrent`
Applies to the release after 1.0.91 (with `w-dwdata-builder` 1.1.46 and `w-data-scheduler` 1.0.77 or later).

- **Before**: when `funAdd`, `funModify` or `funRemove` failed for one item, the rest of the round was canceled, and `fdDwCurrent` was still made an exact copy of `fdDwAttime`, so the failed and the skipped items were never processed again.
- **After**: the other items are processed as usual; a failed item is reported by the `error` event of its stage and by the `warn` event `fail-items-stage-main`. Only the successful items are applied to `fdDwCurrent` (an exact copy when every item succeeded; nothing when the round was canceled), so the failed items are compared and processed again in the next round. `funBeforeEnd` and the `end` listeners receive the result `{ success, failed, msgCancel }`.
- **Migration**: `funAdd`, `funModify` and `funRemove` must be safe to call again. See the Breaking changes of [w-dwdata-builder](https://github.com/yuda-lyu/w-dwdata-builder) for the details.
