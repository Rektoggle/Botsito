const { PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const ticketSchema = require('../../Models/ticketSchema')

const errReply = require('../../Functions/interacttionErrorReply')
const correReply = require('../../Functions/interactionReply');
const { constants } = require('fs');


module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const { customId } = interaction
        if (interaction.isStringSelectMenu && customId === 'menu-ticket') {
            const valor = interaction.values[0]
            const ticketData = await ticketSchema.findOne({ guildId: interaction.guild.id })
            if (!ticketData) return errReply(interaction, "No se ha creado el sistema de tickets", true)
            switch (valor) {
                case 'Enviar MD':
                    const enviarMd = await ticketSupport.findOne({ guildId: interaction.guild.id, openBy: interaction.user.id, open: true })
                    if (enviarMd) return errReply(interaction, "Tienes un ticket creado", true)
                    await interaction.guild.channels.create({
                        name: `${interaction.user.username}-ticket`,
                        type: ChannelType.GuildText,
                        parent: enviarMd.categorymd,
                        permissionsOverwrites: [
                            {
                                id: enviarMd.everyoneRol,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: interaction.member.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                        ],
                    }).then(async (channel) => {
                        const newTicketSchema = await ticketSchema.create({
                            guildId: interaction.guild.id,
                            channelId: channel.id,
                            membersId: interaction.member.id,
                            closed: false,
                            open: true,
                            openBy: interaction.user.id,
                        })
                        const embed = new EmbedBuilder()
                            .setColor('DarkButNotBlack')
                            .setDescription(`${interaction.guild.name} ENVIARMD\nBienvenido <@${interaction.user.id}> a los tickets`)
                            .setTimestamp()

                        const buttom = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('closemd')
                                .setEmoji('<:x:>')
                                .setLabel('Cerrar')
                        )

                        await channel.send({ embeds: [embed], component: [button] })
                        return correReply(interaction, "Se creo correctamnete el sistema de tickets", true)

                    })
                case ' Enviar LOGS':
                    const enviarLogs = await ticketSupport.findOne({ guildId: interaction.guild.id, openBy: interaction.user.id, open: true })
                    if (enviarLogs) return errReply(interaction, "Tienes un ticket creado", true)
                    await interaction.guild.channels.create({
                        name: `${interaction.user.username}-ticket`,
                        type: ChannelType.GuildText,
                        parent: enviarLogs.categorymd,
                        permissionsOverwrites: [
                            {
                                id: enviarLogs.everyoneRol,
                                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                            {
                                id: interaction.member.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                            },
                        ],
                    }).then(async (channel) => {
                        const newTicketSchema = await ticketSchema.create({
                            guildId: interaction.guild.id,
                            channelId: channel.id,
                            membersId: interaction.member.id,
                            closed: false,
                            open: true,
                            openBy: interaction.user.id,
                        })
                        const embed = new EmbedBuilder()
                            .setColor('DarkButNotBlack')
                            .setDescription(`${interaction.guild.name} ENVIARMD\nBienvenido <@${interaction.user.id}> a los tickets`)
                            .setTimestamp()

                        const buttom = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('closelogs')
                                .setEmoji('<:x:>')
                                .setLabel('Cerrar')
                        )

                        await channel.send({ embeds: [embed], component: [button] })
                        return correReply(interaction, "Se creo correctamnete el sistema de tickets", true)

                    })
                    break;
            }
        }

    }
};
