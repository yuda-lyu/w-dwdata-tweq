import path from 'path'
import fs from 'fs'
import _ from 'lodash-es'
import w from 'wsemi'
import downloadEqs from './src/downloadEqs.mjs'


let dayStart = '2025-01-01'
let dayEnd = '2025-12-31'
let v = await downloadEqs(dayStart, dayEnd)
console.log('v', v)

fs.writeFileSync(`./day_${dayStart}_${dayEnd}_eq.json`, JSON.stringify(v, null, 2), 'utf8')


//node g.downloadEqs.mjs
