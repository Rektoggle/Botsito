const { SlashCommandBuilder, EmberBuilder, Client, ChatInputCommandInteraction } = require('discord.js')
const ms = require('ms')
module.exports = {
    Cooldown: ms('1m'),
    data: new SlashCommandBuilder()
        .setName('plantillazzz')
        .setDescription('Este comando es de prueba'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        return interaction.reply({ content: `Hola ${interaction.user}`, ephemeral: true })
    }
};