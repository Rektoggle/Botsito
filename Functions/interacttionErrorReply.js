const {EmbedBuilder} = require('discord.js')

function errorReply(interaction,razon,invisible){
    messageLink.reply({
        embeds:[
            new EmbedBuilder()
            .setTitle('<:X:> Error')
            .addFields(
                {name:'<:X:>', value: `\`\`\`yaml\n${razon}\`\`\``}
            )
            .setColor('DarkRed')
        ],
        ephemeral:invisible
    })
}

module.exports = errorReply