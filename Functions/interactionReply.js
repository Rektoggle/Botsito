const {EmbedBuilder} = require('discord.js')

function errorReply(interaction,razon,invisible){
    messageLink.reply({
        embeds:[
            new EmbedBuilder()
            .setTitle('<:white_check_mark:> Se realizo correctamen la opcion')
            .addFields(
                {name:'<:white_check_mark:>', value: `\`\`\`yaml\n${razon}\`\`\``}
            )
            .setColor('Green')
        ],
        ephemeral:invisible
    })
}

module.exports = errorReply