const { GuildMember, Embed } = require('discord.js')
const welcomeSchema = require('../../Models/welcomeSchema');
const { EmbedBuilder } = require('@discordjs/builders');


module.exports = {
    name: 'guildMemberAdd',
    once: false,
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(member) {
        const welcomeData = await welcomeSchema.findOne({ guildId: member.guild.id })
        if (!welcomeData) return;
        const channel = member.guild.channels.cache.get(welcomeData.channelId);
        const mensaje = welcomeData.message;
        const imagen = welcomeData.imagenUrl;

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username} Acaba de ingresar a ${member.guild.name}`)
            .setDescription(mensaje)
            .setImage(imagen)
            .setColor(0x0099FF)
            .setFooter({ text: `${member.user.id}. Contigo somos: ${member.guild.memberCount} nakamas` })

        return channel?.send({ embeds: [embed] })




    }
};