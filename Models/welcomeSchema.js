const {model, Schema} = require('mongoose')

const welcomeSchema = new Schema({
    guildId: {type: String, required:true},
    channelId: {type: String, required:true},
    message: {type: String, required:true},
    imagenUrl:{type: String, required:true},

})

module.exports = model('bienvenidos', welcomeSchema)