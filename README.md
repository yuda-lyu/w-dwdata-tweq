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
import WDwdataTweq from './src/WDwdataTweq.mjs'

let yearStart = 2022
let yearEnd = 2022
let opt = {}
let ev = await WDwdataTweq(yearStart, yearEnd, opt)
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
// change { event: 'compare', msg: 'start...' }
// change { event: 'compare', numRemove: 0, numAdd: 2, numModify: 0, numSame: 0, msg: 'done' }
// change { event: 'proc-add-callfun-add', id: '111001', msg: 'start...' }
// change { event: 'proc-add-callfun-add', id: '111001', msg: 'done' }
// change { event: 'proc-add-callfun-add', id: '111002', msg: 'start...' }
// change { event: 'proc-add-callfun-add', id: '111002', msg: 'done' }
// ...
```
