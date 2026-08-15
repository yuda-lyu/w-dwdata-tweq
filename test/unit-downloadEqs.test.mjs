import _ from 'lodash-es'
import assert from 'assert'
import downloadEqs from '../src/downloadEqs.mjs'


describe('downloadEqs', function() {

    //call, 攔截fetch執行一次downloadEqs, 回傳所送出之請求與downloadEqs之回傳值
    let call = async(dayStart, dayEnd, opt = {}) => {

        //ok, status, statusText, body, 假回應之內容
        let ok = _.get(opt, 'ok', true)
        let status = _.get(opt, 'status', 200)
        let statusText = _.get(opt, 'statusText', 'OK')
        let body = _.get(opt, 'body', { data: [] })

        //reqs, 記錄各次呼叫fetch所收到之參數
        let reqs = []

        //攔截fetch, 不實際連線氣象署
        let fetchOri = globalThis.fetch
        globalThis.fetch = async(url, o) => {
            reqs.push({ url, o })
            return {
                ok,
                status,
                statusText,
                json: async() => {
                    return body
                },
            }
        }

        //msConsole, 攔截console.log之輸出, 供斷言下載失敗時之錯誤輸出, 亦避免污染測試報告
        let msConsole = []
        let consoleLogOri = console.log
        console.log = (...args) => {
            msConsole.push(args)
        }

        let r = null
        let err = null
        try {
            r = await downloadEqs(dayStart, dayEnd)
        }
        catch (e) {
            err = e
        }
        finally {
            globalThis.fetch = fetchOri
            console.log = consoleLogOri
        }

        //ps, 將所送出之表單內容還原成物件
        let ps = null
        if (_.size(reqs) > 0) {
            ps = Object.fromEntries(new URLSearchParams(reqs[0].o.body))
        }

        return { r, err, reqs, ps, msConsole }
    }

    //getDates, 取出所送出之查詢起訖日
    let getDates = async(dayStart, dayEnd) => {
        let v = await call(dayStart, dayEnd)
        return { txtSDate: v.ps.txtSDate, txtEDate: v.ps.txtEDate }
    }

    it('test downloadEqs: dayStart與dayEnd直接對應txtSDate與txtEDate, 不加減日', async () => {
        let r = await getDates('2022-12-24', '2022-12-24')
        let rr = { txtSDate: '2022-12-24', txtEDate: '2022-12-24' }
        assert.strict.deepEqual(r, rr)
    })

    it('test downloadEqs: 跨年區間之txtSDate與txtEDate', async () => {
        let r = await getDates('2022-1-1', '2023-12-31')
        let rr = { txtSDate: '2022-1-1', txtEDate: '2023-12-31' }
        assert.strict.deepEqual(r, rr)
    })

    it('test downloadEqs: 其他dayjs可解析之格式一律正規化為YYYY-M-D', async () => {
        let r = await getDates('2022/03/05', '2022/03/09')
        let rr = { txtSDate: '2022-3-5', txtEDate: '2022-3-9' }
        assert.strict.deepEqual(r, rr)
    })

    it('test downloadEqs: 以x-www-form-urlencoded之POST送至氣象署ajaxhandler', async () => {
        let v = await call('2022-12-24', '2022-12-24')
        let r = {
            num: _.size(v.reqs),
            url: v.reqs[0].url,
            method: v.reqs[0].o.method,
            contentType: v.reqs[0].o.headers['Content-Type'],
        }
        let rr = {
            num: 1,
            url: 'https://scweb.cwa.gov.tw/zh-tw/earthquake/ajaxhandler',
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
        }
        assert.strict.deepEqual(r, rr)
    })

    it('test downloadEqs: 查詢條件為取全部筆數並依地震時間降冪排序', async () => {
        let v = await call('2022-12-24', '2022-12-24')
        let r = {
            length: v.ps.length,
            orderColumn: v.ps['order[0][column]'],
            orderDir: v.ps['order[0][dir]'],
            orderName: v.ps['columns[2][name]'],
            cblEventNo: v.ps.cblEventNo,
        }
        let rr = {
            length: '-1',
            orderColumn: '2',
            orderDir: 'desc',
            orderName: 'OriginTime',
            cblEventNo: 'Y',
        }
        assert.strict.deepEqual(r, rr)
    })

    it('test downloadEqs: 回應2xx時回傳解析後之數據物件', async () => {
        let body = { recordsTotal: 1, data: [['2022122405175952184', '184   ', '2022-12-24 05:17:59']] }
        let v = await call('2022-12-24', '2022-12-24', { body })
        assert.strict.deepEqual(v.r, body)
    })

    it('test downloadEqs: 回應非2xx時回傳null且不拋錯, 錯誤輸出至console', async () => {
        let v = await call('2022-12-24', '2022-12-24', { ok: false, status: 500, statusText: 'Internal Server Error' })
        let r = {
            r: v.r,
            err: v.err,
            msg: _.get(v.msConsole, [0, 0, 'message'], ''),
        }
        let rr = {
            r: null,
            err: null,
            msg: 'can not download eqs, status[500]: Internal Server Error',
        }
        assert.strict.deepEqual(r, rr)
    })

    //vsInvalid, 無效之日期輸入
    let vsInvalid = [
        { v: null, msg: 'is not an effective string' },
        { v: undefined, msg: 'is not an effective string' },
        { v: '', msg: 'is not an effective string' },
        { v: 2022, msg: 'is not an effective string' },
        { v: 'abc', msg: 'is not a valid date' },
    ]

    it('test downloadEqs: dayStart無效時拋錯且不送出請求', async () => {
        let rs = []
        for (let o of vsInvalid) {
            let v = await call(o.v, '2022-12-24')
            rs.push({ msg: _.get(v, 'err.message', ''), num: _.size(v.reqs) })
        }
        let rr = vsInvalid.map((o) => {
            return { msg: `dayStart ${o.msg}`, num: 0 }
        })
        assert.strict.deepEqual(rs, rr)
    })

    it('test downloadEqs: dayEnd無效時拋錯且不送出請求', async () => {
        let rs = []
        for (let o of vsInvalid) {
            let v = await call('2022-12-24', o.v)
            rs.push({ msg: _.get(v, 'err.message', ''), num: _.size(v.reqs) })
        }
        let rr = vsInvalid.map((o) => {
            return { msg: `dayEnd ${o.msg}`, num: 0 }
        })
        assert.strict.deepEqual(rs, rr)
    })

})
