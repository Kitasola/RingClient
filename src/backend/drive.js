const path = require('path')
const fs = require('fs')
const { loadModule } = require('load-esm')

class DriveHandle {
    #PARENT_DIR_ID
    #drive

    constructor(drive) {
        this.#drive = drive
        this.#PARENT_DIR_ID = '12p8bp6K1BfQEA-_yEft3PrETrr1S-f8i'
    }

    async uploadFile(file, folder = null) {
        const parent_folders = []
        if (folder != null) {
            parent_folders.push(folder)
        } else {
            parent_folders.push(this.#PARENT_DIR_ID)
        }

        const { fileTypeFromFile } = await loadModule('file-type')
        const ft = await fileTypeFromFile(file)
        return this.#drive.files.create({
            requestBody: {
                name: path.basename(file),
                mimeType: ft.mime,
                parents: parent_folders,
            },
            media: {
                mimeType: ft.mime,
                body: fs.createReadStream(file),
            }
        })
    }

    async createFolder(name) {
        // フォルダリスト取得
        const folders = await this.#drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and '${this.#PARENT_DIR_ID}' in parents`,
            fields: 'files(id, name)',
            pageSize: 10,
            orderBy: 'name desc',
        })

        if (!folders.data.files.some(file => file.name === name)) {
            const new_folder = await this.#drive.files.create({
                requestBody: {
                    name: name,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [this.#PARENT_DIR_ID],
                },
                fields: 'id,name'
            })
            folders.data.files.push(new_folder.data)
        }
        return folders.data.files
    }
}

module.exports = {
    DriveHandle,
}