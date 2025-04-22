const getDate = (date = new Date()) => date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
})

const getFormatDate = (date) => date.replaceAll('/', '').replaceAll(' ', '').replaceAll(':', '')

module.exports = {
    getDate,
    getFormatDate,
}