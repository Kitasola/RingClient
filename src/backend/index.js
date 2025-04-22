const { RingApi } = require('ring-client-api')
const Drive = require('@googleapis/drive')
const path = require('path')
const { DriveHandle } = require('./drive.js')
const { CameraHandle } = require('./camera.js')
const { getDate } = require('./utils.js')
const { backup } = require('./backup.js')
const { CronJob } = require('cron')

const start = async () => {
    // RingAPIの初期化
    const ring = new RingApi({
        refreshToken: process.env.RING_REFRESH_TOKEN,
        cameraStatusPollingSeconds: 20,
        controlCenterDisplayName: 'RingBypassClient'
    })

    // カメラへの接続
    const cameras = await ring.getCameras()
    if (!cameras) {
        console.log('cameras not found.')
        return -1
    }
    const camera = new CameraHandle(cameras[0])
    console.log(`success connect to ${camera.name}'s camera.`)

    // スナップショットの定時撮影
    const snapshot_job = CronJob.from({
        cronTime: '0 0 * * * *',
        onTick: async () => {
            const date = getDate()
            console.log(`get snapshot ${date}.`)

            // 録画の撮影
            await camera.getSnapshot(date)

            console.log('finish get snapshot process.')
        },
        start: true,
    })

    // ドアベル押下時の処理
    camera.onDoorbellPressed(async () => {
        snapshot_job.stop()
        const date = getDate()
        console.log(`press doorbell ${date}.`)

        // 録画の撮影
        console.log('get record video.')
        await camera.getRecordVideo(date)

        snapshot_job.start()
        console.log('finish door bell press process.')
    })

    // モーション検出時の処理
    camera.onMotionStarted(async () => {
        snapshot_job.stop()
        const date = getDate()
        console.log(`detect motion ${date}.`)

        // 録画の撮影
        console.log('get record video.')
        await camera.getRecordVideo(date)

        snapshot_job.start()
        console.log('finish detect motion process.')
    })

    // 定期バックアップ処理
    const backup_job = CronJob.from({
        cronTime: '0 0 3 * * *',
        onTick: backup,
        start: true,
    })
}

start()