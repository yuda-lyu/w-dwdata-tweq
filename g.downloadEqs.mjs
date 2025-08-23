import path from 'path'
import fs from 'fs'
import _ from 'lodash-es'
import w from 'wsemi'
import downloadEqs from './src/downloadEqs.mjs'


let yearStart = 2025
let yearEnd = 2025
let v = await downloadEqs(yearStart, yearEnd)
console.log('v', v)

fs.writeFileSync(`./year_${yearStart}_${yearEnd}_eq.json`, JSON.stringify(v, null, 2), 'utf8')


//node g.downloadEqs.mjs
