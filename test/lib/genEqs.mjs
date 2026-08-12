/**
 * 產生測試用地震數據，各網址之組成規則比照parseData，惟主機改指向測試用假伺服器
 *
 * @param {String} urlBase 輸入假伺服器網址字串
 * @param {Object} eq 輸入地震數據物件，需提供id、tag、number、time、timeRec、timeTag與ml
 * @returns {Object} 回傳含各網址欄位之地震數據物件
 */
let genEq = (urlBase, eq) => {

    //tag, 地震戳記, 前4碼為地震西元年, 前6碼為地震西元年月
    let tag = eq.tag
    let timeY = tag.slice(0, 4)
    let timeYM = tag.slice(0, 6)

    //number, 當年地震編號
    let number = eq.number

    return {
        ...eq,
        urlWebEqInfor: `${urlBase}/zh-TW/earthquake/Details/${tag}`,
        urlWebEqReport: `${urlBase}/zh-TW/earthquake/Imgs/${tag}`,
        urlWebEqIntensity: `${urlBase}/zh-TW/earthquake/ShakeMap/${tag}`,
        urlWebEqWave: `${urlBase}/zh-TW/earthquake/WaveformAcc/${tag}`,
        urlPicEqReport: `${urlBase}/webdata/OLDEQ/${timeYM}/${tag}.gif`,
        urlPicEqIntensity: `${urlBase}/webdata/drawTrace/plotContour/${timeY}/${timeY}${number}i.png`,
        urlPicEqPga: `${urlBase}/webdata/drawTrace/plotContour/${timeY}/${timeY}${number}a.png`,
        urlPicEqPgv: `${urlBase}/webdata/drawTrace/plotContour/${timeY}/${timeY}${number}v.png`,
    }
}


//eq114115, 地震114115
let eq114115 = {
    'id': '114115',
    'tag': '2025082116374751115',
    'number': '115',
    'time': '2025-08-21T16:37:47+08:00',
    'timeRec': '2025-08-21 16:37:47',
    'timeTag': '20250821163747',
    'ml': '5.1',
}


//eq114116, 地震114116
let eq114116 = {
    'id': '114116',
    'tag': '2025082214061554116',
    'number': '116',
    'time': '2025-08-22T14:06:15+08:00',
    'timeRec': '2025-08-22 14:06:15',
    'timeTag': '20250822140615',
    'ml': '5.4',
}


//eq114116m, 地震114116之更新版本, 芮氏規模由5.4改為5.6
let eq114116m = {
    ...eq114116,
    'ml': '5.6',
}


export default genEq
export { eq114115, eq114116, eq114116m }
