const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanea a un usuario')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName('usuario')
        .setDescription('Ingresa la id del usuario')
        .setRequired(true)
        ),
        async execute(interaction){
            const {channel,options} = interaction
            const userId = options.getString('usuario')
            const unbanEmbed = new EmbedBuilder()

            try{
                    await interaction.guild.members.unban(userId)
                    unbanEmbed.setTitle('✅| El usuario ha sido unbaneado correctamente')
                    .setDescription(`<@${userId}> fue desbaneado. \n Desbaneado por: ${interaction.user.tag}`)
                    .setColor('Green')
                    .setTimestamp()

                    await interaction.reply({embeds: [unbanEmbed]})

            }catch ( error){
                console.log(errro);
                return interaction.reply({ content: `Ocurrio un erro al trata de unbanear a ${userId}`})
            }

        }
}