const { EmbedBuilder } = require('discord.js')

function errorReply(message, razon){
    message.reply({
        embeds:[
            new EmbedBuilder ()
            .setTitle('<:no_entry_sign:> Error')
            .addFields(
                {name: 'error', value:`\`\`\`yaml\n${razon}\`\`\``}
            )
            .setColor('DarkRed')
        ]
    })
}
module.exports = errorReply