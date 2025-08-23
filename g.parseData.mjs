import path from 'path'
import fs from 'fs'
import _ from 'lodash-es'
import w from 'wsemi'
import parseData from './src/parseData.mjs'


let yearStart = 2025
let yearEnd = 2025
let fp = `./year_${yearStart}_${yearEnd}_eq.json`
let j = fs.readFileSync(fp, 'utf8')
let v = JSON.parse(j)

let eqs = parseData(v)
console.log('eqs', eqs, _.size(eqs))

let eq = _.filter(eqs, (v) => {
    return v.tag === '2024040307580971019'
})
eq = eq[0]
console.log('eq', eq)

fs.writeFileSync(`./year_${yearStart}_${yearEnd}_eqs.json`, JSON.stringify(eqs, null, 2), 'utf8')


//node g.parseData.mjs
