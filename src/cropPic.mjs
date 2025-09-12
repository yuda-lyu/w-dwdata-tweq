import fs from 'fs'
import sharp from 'sharp'


let cropPic = async (fpIn, fpOut, left, top, width, height) => {

    //注意sharp須改使用buff處理, 否則會鎖死檔案
    // await sharp(fpIn, {
    //     animated: false, //設定非動畫
    // })
    //     .extract({ left, top, width, height })
    //     .toFile(fpOut)

    //buffIn
    let buffIn = fs.readFileSync(fpIn)

    //輸入buffIn, 輸出buffOut
    let buffOut = await sharp(buffIn, {
        animated: false, //設定非動畫
    })
        .extract({ left, top, width, height })
        // .toFile(fpOut)
        .toBuffer()

    //writeFileSync
    fs.writeFileSync(fpOut, buffOut)

}


export default cropPic
