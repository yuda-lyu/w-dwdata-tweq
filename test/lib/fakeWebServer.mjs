import http from 'http'
import sharp from 'sharp'


/**
 * 啟動測試用之假HTTP伺服器，模擬氣象署網站提供地震圖檔，供測試downloadPics與cropPic
 *
 * 路徑副檔名為.gif或.png者即時產生對應格式之圖檔，其餘路徑或指定於pathsMissing者回404
 *
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {Integer} [opt.port=0] 輸入監聽port正整數，預設0代表由系統指派可用port
 * @param {Integer} [opt.width=700] 輸入所產生圖檔之寬度正整數，預設700
 * @param {Integer} [opt.height=500] 輸入所產生圖檔之高度正整數，預設500
 * @param {Array} [opt.pathsMissing=[]] 輸入強制回404之路徑字串陣列，供測試下載失敗，預設[]
 * @returns {Promise} 回傳Promise，resolve回傳伺服器物件，內含實際監聽port正整數、伺服器網址字串urlBase、所收到請求路徑陣列reqs與關閉伺服器函數close
 */
let fakeWebServer = async(opt = {}) => {

    //port, 0代表由系統指派可用port, 供mocha平行測試時避免衝突
    let port = opt.port || 0

    //width, height, 所產生圖檔之尺寸, 須大於cropPic自picEqReport.gif所裁切之範圍(left 364, top 199, width 276, height 204)
    let width = opt.width || 700
    let height = opt.height || 500

    //pathsMissing, 強制回404之路徑
    let pathsMissing = opt.pathsMissing || []

    //reqs, 記錄所收到之請求路徑
    let reqs = []

    //sockets, 記錄所有連線, 供close時強制銷毀(fetch預設keep-alive, 不銷毀會使伺服器無法關閉)
    let sockets = new Set()

    //kpPics, 快取各路徑之圖檔, 使同一路徑之多次下載內容一致
    let kpPics = {}

    //genPic, 依副檔名產生對應格式之圖檔
    let genPic = async(pathname) => {

        if (kpPics[pathname] === undefined) {

            //img, 底色依路徑字元和決定, 使各路徑之圖檔內容互異
            let n = 0
            for (let i = 0; i < pathname.length; i++) {
                n += pathname.charCodeAt(i)
            }
            let img = sharp({
                create: {
                    width,
                    height,
                    channels: 3,
                    background: { r: n % 256, g: (n * 7) % 256, b: (n * 13) % 256 },
                },
            })

            //buff
            let buff = null
            if (pathname.endsWith('.gif')) {
                buff = await img.gif().toBuffer()
            }
            else {
                buff = await img.png().toBuffer()
            }

            kpPics[pathname] = buff

        }

        return kpPics[pathname]
    }

    //srv
    let srv = http.createServer((req, res) => {

        //pathname
        let pathname = new URL(req.url, 'http://127.0.0.1').pathname

        reqs.push(pathname)

        //check
        let isPic = pathname.endsWith('.gif') || pathname.endsWith('.png')
        if (!isPic || pathsMissing.indexOf(pathname) >= 0) {
            res.writeHead(404)
            res.end('not found')
            return
        }

        genPic(pathname)
            .then((buff) => {
                res.writeHead(200, {
                    'Content-Type': pathname.endsWith('.gif') ? 'image/gif' : 'image/png',
                    'Content-Length': buff.length,
                })
                res.end(buff)
            })
            .catch(() => {
                res.writeHead(500)
                res.end('error')
            })

    })
    srv.on('connection', (socket) => {
        sockets.add(socket)
        socket.on('close', () => {
            sockets.delete(socket)
        })
    })

    //listen
    await new Promise((resolve) => {
        srv.listen(port, '127.0.0.1', resolve)
    })

    //close
    let close = async() => {
        for (let s of sockets) {
            s.destroy()
        }
        return new Promise((resolve) => {
            srv.close(resolve)
        })
    }

    return {
        port: srv.address().port,
        urlBase: `http://127.0.0.1:${srv.address().port}`,
        reqs,
        close,
    }
}


export default fakeWebServer
