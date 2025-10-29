import map from 'lodash-es/map.js'
import join from 'lodash-es/join.js'
import cint from 'wsemi/src/cint.mjs'
import axios from 'axios'


let stringify = (obj) => {

    let rs = map(obj, (value, key) => {
        // null or undefined 處理成空字串
        let v = value == null ? '' : value
        return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
    })

    let c = join(rs, '&')

    return c
}


let downloadEqs = async(yearStart, yearEnd) => {

    let url = 'https://scweb.cwa.gov.tw/zh-tw/earthquake/ajaxhandler'

    let txtSDate = `${cint(yearStart)}-1-1`
    // let txtEDate = `${yearEnd}-12-31` //ot().format('YYYY')
    let txtEDate = `${cint(yearEnd) + 1}-1-1` //ot().format('YYYY')

    let postData = {
        'draw': 6, //DataTables的請求序號, 網頁使用時會自動遞增
        'columns[0][data]': 0,
        'columns[0][name]': 'EventNo',
        'columns[0][searchable]': false,
        'columns[0][orderable]': true,
        'columns[0][search][value]': '',
        'columns[0][search][regex]': false,
        'columns[1][data]': 1,
        'columns[1][name]': 'MaxIntensity',
        'columns[1][searchable]': true,
        'columns[1][orderable]': true,
        'columns[1][search][value]': '',
        'columns[1][search][regex]': false,
        'columns[2][data]': 2,
        'columns[2][name]': 'OriginTime',
        'columns[2][searchable]': true,
        'columns[2][orderable]': true,
        'columns[2][search][value]': '',
        'columns[2][search][regex]': false,
        'columns[3][data]': 3,
        'columns[3][name]': 'MagnitudeValue',
        'columns[3][searchable]': true,
        'columns[3][orderable]': true,
        'columns[3][search][value]': '',
        'columns[3][search][regex]': false,
        'columns[4][data]': 4,
        'columns[4][name]': 'Depth',
        'columns[4][searchable]': true,
        'columns[4][orderable]': true,
        'columns[4][search][value]': '',
        'columns[4][search][regex]': false,
        'columns[5][data]': 5,
        'columns[5][name]': 'Description',
        'columns[5][searchable]': true,
        'columns[5][orderable]': true,
        'columns[5][search][value]': '',
        'columns[5][search][regex]': false,
        'columns[6][data]': 6,
        'columns[6][name]': 'Description',
        'columns[6][searchable]': true,
        'columns[6][orderable]': true,
        'columns[6][search][value]': '',
        'columns[6][search][regex]': false,
        'order[0][column]': 2,
        'order[0][dir]': 'desc',
        'start': 0,
        'length': -1, //全部資料
        'search[value]': '',
        'search[regex]': false,
        'Search': '',
        txtSDate,
        txtEDate,
        'txtSscale': '',
        'txtEscale': '',
        'txtSdepth': '',
        'txtEdepth': '',
        'txtLonS': '',
        'txtLonE': '',
        'txtLatS': '',
        'txtLatE': '',
        'ddlCity': '',
        'ddlTown': '',
        'ddlCitySta': '',
        'ddlStation': '',
        'txtIntensityB': '',
        'txtIntensityE': '',
        'txtLon': '',
        'txtLat': '',
        'txtKM': '',
        'ddlStationName': '------',
        'cblEventNo': 'Y',
        'txtSDatePWS': '',
        'txtEDatePWS': '',
        'txtSscalePWS': '',
        'txtEscalePWS': '',
        'ddlMark': '',
    }

    let r = null
    try {
        let res = await axios.post(url, stringify(postData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        r = res.data
    }
    catch (err) {
        console.log(err)
    }

    return r
}


export default downloadEqs
