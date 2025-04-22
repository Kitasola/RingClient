const express = require('express')
const router = express.Router()
const { glob } = require('glob')
const path = require('path')
const { loadModule } = require('load-esm')

router.get('/', async (req, res, next) => {
    const { fileTypeFromFile } = await loadModule('file-type')
    const files = await glob(path.join(__dirname, '../../output/**.**'))
    const files_data = await Promise.all(
        files.map(async (file) => {
            return {
                'name': path.basename(file),
                'type': await fileTypeFromFile(file)
            }
        })
    )
    res.json({ 'files': files_data })
})

router.get('/:filename', async (req, res, next) => {
    res.sendFile(
        req.params.filename,
        {
            root: path.join(__dirname, '../../output/')
        }),
        (error) => {
            if (error) {
                res.end()
            }
        }

})

module.exports = router