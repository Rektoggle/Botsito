const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionCollector} = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea un usuario del servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
        option.setName('usuario')
        .setDescription('Elige el usuario a banear')
        .setRequired(true)
        )
        .addStringOption(option=>
            option.setName('razon')
            .setDescription('Razon del Banneo')
            .setRequired(false)
        ),

        async execute (interaction){
            const {channel, options} = interaction
            const user = options.getUser('usuario')
            const razon = options.getString('razon') || 'No se especifico la razon'

            const member = await interaction.guild.members.fetch(user.id)

            const embedError = new EmbedBuilder()
            .setDescription(`No puedes banear a ${user}, ya que tienen un rol mayor`)
            .setColor('DarkRed')

            if(member.roles.highest.position >= interaction.member.roles.highest.position){
                return interaction.reply({embeds : [embedError]})
            }

                await member.ban({razon})

            const embedBan = new EmbedBuilder()
            .setTitle(`✅| Usuario baneado correctamente`)
            .setDescription(`${user} fue baneado por : ${razon}`)
            .setFields(
                {name: `Id`, value:`${user.id}`}
            )
            .setColor('Green')
            .setTimestamp()

            await interaction.reply({embeds:[embedBan]})
        }

};