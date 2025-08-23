import sharp from 'sharp'


let cropPic = async (fpIn, fpOut, left, top, width, height) => {

    await sharp(fpIn, {
        animated: false, //設定非動畫
    })
        .extract({ left, top, width, height })
        .toFile(fpOut)

}


export default cropPic
