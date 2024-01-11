const { SlashCommandBuilder, EmberBuilder, Client, ChatInputCommandInteraction } = require('discord.js')
const ms = require('ms')
module.exports = {
    Cooldown: ms('1m'),
    data: new SlashCommandBuilder()
        .setName('kiara')
        .setDescription('Este comando es de prueba'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        return interaction.reply({ content: `Ahora si entiendes ${interaction.user}?`})
    }
};