import fs from 'fs'
import get from 'lodash-es/get.js'
import isp0int from 'wsemi/src/isp0int.mjs'
import cdbl from 'wsemi/src/cdbl.mjs'
import cint from 'wsemi/src/cint.mjs'
import delay from 'wsemi/src/delay.mjs'


let core = async (url, fp) => {

    //fetch
    let res = await fetch(url)

    //check
    if (!res.ok) {
        throw new Error(`can not download file, status[${res.status}]: ${res.statusText}`)
    }

    //buffer
    let arrayBuffer = await res.arrayBuffer()
    let buffer = Buffer.from(arrayBuffer)

    //writeFile
    fs.writeFileSync(fp, buffer)

}


let downloadFile = async (url, fp, opt = {}) => {

    //retries
    let retries = get(opt, 'retries')
    if (!isp0int(retries)) {
        retries = 3
    }
    retries = cint(retries)

    //timeDelay
    let timeDelay = get(opt, 'retrietimeDelays')
    if (!isp0int(timeDelay)) {
        timeDelay = 1000
    }
    timeDelay = cdbl(timeDelay)

    let state = 'error'
    let errFin = null
    let resFin = null
    for (let i = 1; i <= retries; i++) {

        //core
        await core(url, fp)
            .then((res) => {
                resFin = res
                state = 'success'
            })
            .catch((err) => {
                errFin = err
            })

        //delay
        await delay(timeDelay)

        //check
        if (resFin !== null) {
            break
        }

    }

    if (state === 'error') {
        throw new Error(errFin)
    }
    return resFin
}


export default downloadFile
