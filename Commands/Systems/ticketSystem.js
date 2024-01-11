const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChatInputCommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits, ChannelType, ComponentType, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle, SystemChannelFlagsBitField } = require('discord.js')
const ticketSchema = require('../../Models/ticketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Administra el sistema de tickets')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(option =>
            option.setName('configurar')
                .setDescription('Crea o eloimina el sistema de tickets')
                .addStringOption(option =>
                    option.setName('elegir')
                        .setDescription('Elige lo que quieres hacer con el sistema de tickets')
                        .addChoices(
                            { name: 'Crear', value: 'c' },
                            { name: 'Eliminar', value: 'e' },
                        )
                        .setRequired(true)
                )
        ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('menu-ticket')
                .setMaxValues(3)
                .setMinValues(1)
                .setPlaceholder('Elige lo que te pide el mensaje')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Enviar MD')
                        .setDescription('Crea el sistema para enviar MD')
                        .setEmoji('🐧')
                        .setValue('s-emd'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Enviar LOGS')
                        .setDescription('Envia logs de los tickets')
                        .setEmoji('🦔')
                        .setValue('s-elg'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Sistema de CALIFICACIONES')
                        .setDescription('Crea un sistema de calificaciones')
                        .setEmoji('🐬')
                        .setValue('s-clf'),
                )


        )

        const embedDescTicket = new EmbedBuilder()
            .setTitle('Descripcion del sistema de tickets')
            .setDescription(`Ingresa a continuacion la descripcion que usaras para el sistema de Tickes\n\n**Primer Mensaje:** Para la descripcion del sistema de tickets. (Max 3000 caracteres)\n**Segundo Mensaje:** Nombre del boton (Max 70 caracteres\n **Tercer Mensaje:** Emoji. (Ingresar iun emoji en el cual el bot pueda acceder, caso contrario no terminara el sistema de tickets)\n\n**Nota:** Cada vez que ingreses \`\`\`,,\`\`\` se hara un salto de linea en tu texto\n\n⬇️⬇️⬇️⬇️⬇️⬇️⬇️`)
            .setColor('DarkButNotBlack')
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })

        const embedInicial = new EmbedBuilder()
            .setTitle(' Configuracion incial del sistema de Tickets')
            .setDescription(`Hola ${interaction.user} vamos a empezar con la configuracion del sistema de Tickets para tu servidor de Discord\n\n**Elige** los sistemas que desees que tenga tu servidor. `)
            .setColor('DarkButNotBlack')
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })


        const systemConfig = {
            categoriaTickets: null,
            mensajeTickets: null,
            buttonName: null,
            emojiName: null,
            enviarMd: false,
            enviarLogs: false,
            channelLogs: null,
            enviarCalificaciones: false,
            channelCalificaciones: null,
            roleTicket: null,
        }

        const collectorFilter = i => {
            i.deferUpdate()
            return i.user.id === interaction.user.id
        }

        const canalesElegir = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setChannelTypes(ChannelType.GuildText)
                .setCustomId('channel-sel')
                .setMaxValues(1)
                .setMinValues(1)

        )


        const categoriaElegir = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setChannelTypes(ChannelType.GuildCategory)
                .setCustomId('channel-sel-cat')
                .setMaxValues(1)
                .setMinValues(1)

        )


        const roleElegir = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId('role-elegir')
                .setMaxValues(1)
                .setMinValues(1)

        )

        const subCommand = interaction.options.getSubcommand()
        const ticketData = await ticketSchema.findOne({ guildId: interaction.guild.id })
        const subCommandElegir = interaction.options.getString('elegir')

        switch (subCommand) {
            case 'configurar':
                switch (subCommandElegir) {
                    case 'c':
                        try {
                            if (ticketData) return interaction.reply({ content: 'Hey, no puedes crear nuevamente un sistema de tickets ya que hay uno actual', ephemeral: true })
                            var messageUsuario = await interaction.reply({ components: [menu], embeds: [embedInicial] })
                            const chooseModal = await messageUsuario?.awaitMessageComponent({ filter: collectorFilter, time: 120000, componentType: ComponentType.StringSelect })
                            if (!chooseModal || chooseModal.values.length < 1) return;
                            for (const value of chooseModal.values) {
                                switch (value) {
                                    case 's-emd':
                                        systemConfig.enviarMd = true
                                        break;

                                    case 's-elg':
                                        await messageUsuario?.edit({ content: 'Elige el canal donde se va a mostrar los logs', components: [canalesElegir], embeds: [] })
                                        const channelLogs = await messageUsuario?.awaitMessageComponent({ filter: collectorFilter, time: 120000, componentType: ComponentType.ChannelSelect })
                                        systemConfig.enviarLogs = true
                                        systemConfig.channelLogs = channelLogs.id
                                        break;
                                    case 's-clf':
                                        await messageUsuario?.edit({ content: 'Elige el canal donde se va a mostrar los calificaciones', components: [canalesElegir], embeds: [] })
                                        const channelCalificaciones = await messageUsuario?.awaitMessageComponent({ filter: collectorFilter, time: 120000, componentType: ComponentType.ChannelSelect })
                                        systemConfig.enviarCalificaciones = true
                                        systemConfig.channelCalificaciones = channelCalificaciones.id
                                        break;
                                }
                            }

                            await messageUsuario?.edit({ content: 'Elige la categoria donde se va a mostrar los tickets', components: [categoriaElegir], embeds: [] })
                            const categoriaTickets = await messageUsuario?.awaitMessageComponent({ filter: collectorFilter, time: 120000, componentType: ComponentType.ChannelSelect })
                            systemConfig.categoriaTickets = categoriaTickets.id

                            await messageUsuario?.edit({ content: 'Elige el rol que deseas que pueda administrar los tickets', components: [roleElegir], embeds: [] })
                            const roleTickets = await messageUsuario?.awaitMessageComponent({ filter: collectorFilter, time: 120000, componentType: ComponentType.RoleSelect })
                            systemConfig.roleTicket = roleTickets.id

                            await messageUsuario?.edit({ content: '',embeds: [embedDescTicket], components: [] })

                            const collector = interaction.channel.createMessageCollector({ filter: m => m.channel.id == interaction.channel.id && m.author.id == interaction.user.id, time: 120000 })
                            let counter = 0;

                            collector.on('collect', (m) => {
                                if (counter == 0) systemConfig.mensajeTickets = m.content.replace(/,,/g, "\n").substring(0, 3000)
                                else if (counter == 1) systemConfig.buttonName = m.content.substring(0, 70)
                                else if (counter == 2) systemConfig.emojiName = m.content.substring(0, 200)
                                counter++
                                if (counter == 3) return collector.stop()


                            })

                            collector.on('end', async (m) => {
                                if (m.size < 1) return messageUsuario.edit({ content: 'EL sistema de tickets termino ya que no se ingreso ninguna descripcion de lo requerido', components: [], embeds: [] })
                                m.map(async (m) => m.delete().catch((e) => { }))

                                const embedMostrar = new EmbedBuilder()
                                    .setTitle('Sistema de Tickets')
                                    .setDescription(systemConfig.mensajeTickets)
                                    .setColor('Random')
                                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })

                                const buttonsTicket = new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('crear ticket ')
                                        .setLabel(systemConfig.buttonName)
                                        .setEmoji(systemConfig.emojiName)
                                        .setStyle(ButtonStyle.Danger)
                                )




                                if (!ticketData) {
                                    await ticketSchema.create({
                                        guildID: interaction.guild.id,
                                        categoriaId: systemConfig.categoriaTickets,
                                        enviarMd: systemConfig.enviarMd,
                                        enviarLogs: systemConfig.enviarLogs,
                                        enviarCalificaciones: systemConfig.enviarCalificaciones,
                                        channelLogs: systemConfig.channelLogs,
                                        channelCalificaciones: systemConfig.channelCalificaciones,
                                        roleId: systemConfig.roleTicket
                                    })
                                }

                                await interaction.channel.send({ embed: [embedMostrar], components: [buttonsTicket] })
                                await messageUsuario?.edit({ content: 'Se creo correctamente el sistema de Tickets', embeds: [], components: [] })
                            })

                        } catch (error) {
                            return messageUsuario?.edit({ content: 'Acabo el tiempo para elegir, usa nuevamente el comando para volver a empezar una nueva instalacion.', embeds: [], components: [], ephemeral: true })

                        }

                        break;
                    case 'e':
                        if (!ticketData) return interaction.reply({ content: 'No puedes eliminar cuando aun no esta crreado, para eliminar necesitas crear primero el sistema', ephemeral: true })
                        await ticketSchema.findOneAndDelete({ guildId: interaction.guild.id })
                        interaction.reply({ content: 'Se elimino correctamente el sistema de tcikets actual, si deseas puedes crear otro', ephemeral: true })
                        break;
                }

                break;

        }

    }

};



