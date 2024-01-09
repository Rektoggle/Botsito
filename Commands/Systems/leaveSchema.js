const { SlashCommandBuilder, EmberBuilder, Client, ChatInputCommandInteraction, ChannelType } = require('discord.js')
const welcomeSchema = require('../../Models/leaveSchema');
module.exports = {
    Cooldown: false,
    data: new SlashCommandBuilder()
        .setName('sistema-salidas')
        .setDescription('Crea un sistema de salidas')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Elige el canal dónde se mostrara el mensaje')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('Ingrese el mensaje de salida')
                .setMinLength(1)
                .setMaxLength(3000)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('imagen')
                .setDescription('Ingrese la imagen que saldrá en el embed')
                .setMinLength(1)
                .setRequired(true)
        ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const canal = interaction.options.getChannel('canal')
        const mensaje = interaction.options.getString('mensaje').replace(/,/g, "\n");
        const imagen = interaction.options.getString('imagen');

        const welcomeData = await welcomeSchema.findOne({ guildId: interaction.guild.id });

        if (!welcomeData) {
            await welcomeSchema.create({
                guildId: interaction.guild.id,
                channelId: canal.id,
                message: mensaje,
                imagenUrl: imagen,
            })

            return interaction.reply({ content: `Se creo correctamente el sistema de salidas`, ephemeral: true })
        } else {
            await welcomeSchema.findOneAndUpdate({
                guildId: interaction.guild.id
            }, {
                guildId: interaction.guild.id,
                channelId: canal.id,
                message: mensaje,
                imagenUrl: imagen,
            })

            return interaction.reply({ content: `Se actualizó correctamente el sistema de salidas`, ephemeral: true })


        }
    }
};