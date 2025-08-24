import get from 'lodash-es/get.js'
import map from 'lodash-es/map.js'
import trim from 'lodash-es/trim.js'
import isnum from 'wsemi/src/isnum.mjs'
import cint from 'wsemi/src/cint.mjs'
import ot from 'dayjs'


let parseData = (o) => {
    //heads:
    //   "eArea": "小區域有感地震",
    //   "eDetailsEvent": "第{0}號",
    //   "hDate": "日期",
    //   "hTime": "時間",
    //   "eDetailsDate3": "yyyy年M月d日",
    //   "eDetailsDate4": "H時m分s秒",
    //   "Location": "位置",
    //   "eDetailsLat": "北緯 {0} °",
    //   "eDetailsLon": "東經 {0} °",
    //   "eDetailsDepth": "地震深度",
    //   "eDetailsScale": "芮氏規模",
    //   "hKM": "公里",
    //   "OrginDate": "地震時間",
    //   "Scale": "規模",
    //   "Depth": "深度",
    //   "Lon": "經度",
    //   "Lat": "緯度",
    //   "hDistrict": "行政分區",
    //   "gStation": "測站名稱",
    //   "Intensity": "震度",
    //   "gCenter": "中心位置",
    //   "gRadius": "半徑",
    //   "eFar": "遠地地震"

    let data = get(o, 'data', [])

    let rs = map(data, (v) => {
        //value:
        //  "2025081903554745113", //地震戳記
        //  "113   ", //當年地震編號
        //  "2025-08-19 03:55:47", //地震時間
        //  "4.5", //芮式規模
        //  "22.4", //深度(km)
        //  "花蓮縣政府東北方  28.0  公里 (位於臺灣東部海域)", //地震位置
        //  "3", //最大震度
        //  "121.836", //經度
        //  "24.1473", //緯度
        //  "Alert"

        let tag = get(v, 0, '') //地震戳記
        let number = get(v, 1, '') //當年地震編號
        let timeRec = get(v, 2, '') //地震時間
        let ml = get(v, 3, '') //芮式規模
        let depth = get(v, 4, '') //深度(km)
        let location = get(v, 5, '') //地震位置
        let intensity = get(v, 6, '') //最大震度
        let longitude = get(v, 7, '') //經度
        let latitude = get(v, 8, '') //緯度

        number = trim(number)

        let t = ot(timeRec, 'YYYY-MM-DD HH-mm:ss')

        let time = t.format('YYYY-MM-DDTHH:mm:ssZ') //轉UTC時間

        let timeTag = t.format('YYYYMMDDHHmmss')

        let timeY = t.format('YYYY')

        let timeYM = t.format('YYYYMM')

        //地震id
        let id = ''
        if (isnum(number) && isnum(timeY)) {
            id = `${cint(timeY) - 1911}${number}`
        }

        //地震資訊網頁
        // https://scweb.cwa.gov.tw/zh-TW/earthquake/Details/{地震戳記}
        // 例: https://scweb.cwa.gov.tw/zh-TW/earthquake/Details/2025081903554745113
        let urlWebEqInfor = `https://scweb.cwa.gov.tw/zh-TW/earthquake/Details/${tag}`

        //地震報告(圖)網頁
        // https://scweb.cwa.gov.tw/zh-TW/earthquake/Imgs/{地震戳記}
        // 例: https://scweb.cwa.gov.tw/zh-TW/earthquake/Imgs/2025081903554745113
        let urlWebEqReport = `https://scweb.cwa.gov.tw/zh-TW/earthquake/Imgs/${tag}`

        //震度圖網頁
        // https://scweb.cwa.gov.tw/zh-TW/earthquake/ShakeMap/{地震戳記}
        // 例: https://scweb.cwa.gov.tw/zh-TW/earthquake/ShakeMap/2025081903554745113
        let urlWebEqIntensity = `https://scweb.cwa.gov.tw/zh-TW/earthquake/ShakeMap/${tag}`

        //即時強地動震波圖網頁
        // https://scweb.cwa.gov.tw/zh-TW/earthquake/WaveformAcc/{地震戳記}
        // 例: https://scweb.cwa.gov.tw/zh-TW/earthquake/WaveformAcc/2025081903554745113
        let urlWebEqWave = `https://scweb.cwa.gov.tw/zh-TW/earthquake/WaveformAcc/${tag}`

        //地震報告(圖)
        // https://scweb.cwa.gov.tw/webdata/OLDEQ/{地震西元年月}/{地震戳記}.gif
        // 例: https://scweb.cwa.gov.tw/webdata/OLDEQ/202508/2025081903554745113.gif
        let urlPicEqReport = `https://scweb.cwa.gov.tw/webdata/OLDEQ/${timeYM}/${tag}.gif`

        //震度圖
        // https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/{地震西元年}/{地震西元年}{當年地震編號}i.png
        // 例: https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025113i.png
        let urlPicEqIntensity = `https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/${timeY}/${timeY}${number}i.png`

        //最大地動加速度圖
        // https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/{地震西元年}/{地震西元年}{當年地震編號}a.png
        // 例: https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025113a.png
        let urlPicEqPga = `https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/${timeY}/${timeY}${number}a.png`

        //最大地動速度圖
        // https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/{地震西元年}/{地震西元年}{當年地震編號}v.png
        // 例: https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/2025/2025113v.png
        let urlPicEqPgv = `https://scweb.cwa.gov.tw/webdata/drawTrace/plotContour/${timeY}/${timeY}${number}v.png`

        let r = {

            id,
            tag,
            number,
            time,
            timeRec,
            timeTag,
            ml,
            depth,
            location,
            intensity,
            longitude,
            latitude,

            urlWebEqInfor,
            urlWebEqReport,
            urlWebEqIntensity,
            urlWebEqWave,
            urlPicEqReport,
            urlPicEqIntensity,
            urlPicEqPga,
            urlPicEqPgv,

        }

        return r
    })
    // console.log('rs', rs)

    return rs
}


export default parseData
