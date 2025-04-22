const { RingApi } = require('ring-client-api')
const fs = require('fs').promises
const path = require('path')
const { getFormatDate } = require('./utils.js')

class CameraHandle {
    #OUTPUT_DIR_PATH
    #SNAPSHOT_BASENAME
    #RECORD_BASENAME
    #RECORD_TIME
    #camera
    name

    constructor(camera) {
        this.#OUTPUT_DIR_PATH = path.join(__dirname, '../../output')
        this.#SNAPSHOT_BASENAME = 'snapshot.jpeg'
        this.#RECORD_BASENAME = 'record.mp4'
        this.#RECORD_TIME = 30
        this.#camera = camera
        this.name = camera.name
    }

    async getSnapshot(date) {
        const format_date = getFormatDate(date)
        const snapshot = await this.#camera.getSnapshot()
        const file_path = path.join(this.#OUTPUT_DIR_PATH, `${format_date}_${this.#SNAPSHOT_BASENAME}`)
        await fs.writeFile(file_path, snapshot)
            .catch((error) => {
                console.log(`Error: save snapshot failed. ${error}`)
                return null
            })
        return file_path
    }

    async getRecordVideo(date, time = this.#RECORD_TIME) {
        const format_date = getFormatDate(date)
        const file_path = path.join(this.#OUTPUT_DIR_PATH, `${format_date}_${this.#RECORD_BASENAME}`)
        await this.#camera.recordToFile(file_path, time)
            .catch((error) => {
                console.log(`Error: save record video. ${error}`)
                return null
            })
        return file_path
    }

    onDoorbellPressed(func) {
        return this.#camera.onDoorbellPressed.subscribe(func)
    }

    onMotionStarted(func) {
        return this.#camera.onMotionStarted.subscribe(func)
    }

    async cleanOutput() {
        await fs.rm(this.#OUTPUT_DIR_PATH, {
            force: true,
            recursive: true
        })
        await fs.mkdir(this.#OUTPUT_DIR_PATH)
    }
}


module.exports = {
    CameraHandle,
}