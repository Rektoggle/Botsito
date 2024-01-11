const { model, Schema } = require('mongoose')

const ticketSchema = new Schema({
    guildId: { type: String, required: false },
    categoriaId: { type: String, required: false },
    enviarMd: { type: Boolean, required: false },
    enviarLogs: { type: Boolean, required: false },
    enviarCalificaciones: { type: Boolean, required: false },
    channelLogs: { type: String, required: false },
    channelCalificaciones: { type: String, required: false },
    roleId: { type: String, required: false },
})

module.exports = model('ticketsconfig', ticketSchema)