const { GuildMember, Embed } = require('discord.js')
const welcomeSchema = require('../../Models/leaveSchema');
const { EmbedBuilder } = require('@discordjs/builders');


module.exports = {
    name: 'guildMemberRemove',
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
            .setTitle(`${member.user.username} Acaba de retirarse  ${member.guild.name}, nakama que tenga buenas aventuras`)
            .setDescription(mensaje)
            .setImage(imagen)
            .setColor(0x0099FF)
            .setFooter({ text: `${member.user.id}. Ahora somos: ${member.guild.memberCount} nakamas` })

        return channel?.send({ embeds: [embed] })




    }
};