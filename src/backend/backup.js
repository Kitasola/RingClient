const Drive = require('@googleapis/drive')
const path = require('path')
const { DriveHandle } = require('./drive.js')
const { glob } = require('glob')
const fs = require('fs').promises
const { getDate, getFormatDate } = require('./utils.js')

const BACKUP_DURATION = 1

const backup = async () => {
    // GoogleAPIの初期化
    const auth = new Drive.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../credentials.json'),
        scopes: [
            'https://www.googleapis.com/auth/drive.file',
        ]
    })
    const drive = new DriveHandle(
        Drive.drive({
            version: 'v3',
            auth: auth
        })
    )

    console.log('start backup.')
    // 出力ファイル一覧の取得
    const files = await glob(path.join(__dirname, '../../output/**.**'))
    const today = new Date()
    // 基準日時を実行日時の0:00:00に設定
    today.setHours(0, 0, 0, 0)

    // バックアップ用Driveフォルダの作成
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const new_folder = getFormatDate(getDate(yesterday)).substring(0, 8)
    const folders = await drive.createFolder(new_folder)

    for (const file of files) {
        const file_date = await getFileDate(file)

        // 基準日時との差分の取得
        const day_duration = (today.getTime() - file_date.getTime()) / (60 * 60 * 24)

        // BACKUP_DURATION以前のファイルのみバックアップ
        if (day_duration > BACKUP_DURATION) {
            // アップロード先のフォルダID取得
            const folder = folders.find(folder => folder.name === path.basename(file).substring(0, 8))

            // ファイルのアップロード
            const res = await drive.uploadFile(file, folder.id)
            console.log('upload:', res.data)

            await fs.rm(file)
                .catch(err => {
                    console.log(`not found: ${file}`)
                })
        }
    }

    console.log('finish backup.')
}

const getFileDate = async (file) => {
    const date_str = path.basename(file).match(/\d{14}/)[0]
    const y = parseInt(date_str.substring(0, 4))
    const m = parseInt(date_str.substring(4, 6))
    const d = parseInt(date_str.substring(6, 8))
    const h = parseInt(date_str.substring(8, 10))
    const mm = parseInt(date_str.substring(10, 12))
    const s = parseInt(date_str.substring(12, 14))
    return new Date(y, m - 1, d, h, mm, s)
}

module.exports = {
    backup,
}