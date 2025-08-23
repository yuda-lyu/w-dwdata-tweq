import pmSeries from 'wsemi/src/pmSeries.mjs'
import downloadFile from './downloadFile.mjs'
import fsIsFolder from 'wsemi/src/fsIsFolder.mjs'
import fsCreateFolder from 'wsemi/src/fsCreateFolder.mjs'


let downloadPics = async (fd, v) => {

    // urlWebEqInfor: 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Details/2024040307580971019',
    // urlWebEqReport: 'https://scweb.cwa.gov.tw/zh-TW/earthquake/Imgs/2024040307580971019',
    // urlWebEqIntensity: 'https://scweb.cwa.gov.tw/zh-TW/earthquake/ShakeMap/2024040307580971019',
    // urlWebEqWave: 'https://scweb.cwa.gov.tw/zh-TW/earthquake/WaveformAcc/2024040307580971019',
    // urlPicEqReport: 'https://scweb.cwa.gov.tw/webdata/OLDEQ/202404/2024040307580971019.gif',
    // urlPicEqIntensity: 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2024/2024019i.png',
    // urlPicEqPga: 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2024/2024019a.png',
    // urlPicEqPgv: 'https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2024/2024019v.png'

    //check
    if (!fsIsFolder(fd)) {
        fsCreateFolder(fd)
    }

    //ms
    let ms = [
        {
            url: v.urlPicEqReport,
            fn: `picEqReport.gif`,
        },
        {
            url: v.urlPicEqIntensity,
            fn: `picEqIntensity.png`,
        },
        {
            url: v.urlPicEqPga,
            fn: `picEqPga.png`,
        },
        {
            url: v.urlPicEqPgv,
            fn: `picEqPgv.png`,
        },
    ]

    await pmSeries(ms, async(m) => {
        // console.log('m', m)

        //fp
        let fp = `${fd}/${m.fn}`

        //downloadFile
        await downloadFile(m.url, fp)

    })

}


export default downloadPics
