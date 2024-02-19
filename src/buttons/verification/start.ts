import { DiscordClient } from '../../bot.js';
import { ButtonInterface } from '../../components/typings/index.js';
import {
    AttachmentBuilder,
    ButtonInteraction,
    EmbedBuilder,
    Message,
    Role,
    TextChannel,
    userMention,
} from 'discord.js';
import { getGuildTheme, getFooter, sendEmbedLogMessage } from '../../components/helpers/exports.js';
import { logger } from '../../components/handlers/exports.js';
import i18next from '../../components/handlers/i18n.js';

import { CaptchaGenerator } from 'captcha-canvas';

const button: ButtonInterface = {
    customId: 'verificationStart',
    cooldown: 150,
    permissions: ['ViewChannel'],
    interactionAuthorOnly: false,
    execute: async (interaction: ButtonInteraction, client: DiscordClient) => {
        const { guild, guildId, member } = interaction;
        if (!guild) return;
        if (!guildId) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        await getFooter(guild, client, embed);

        const fetchedMember = await guild.members.fetch(member!.user.id);
        if (!fetchedMember)
            return interaction.reply({
                embeds: [
                    embed.setDescription(
                        i18next.t('verification.start.failedToFetchUser', {
                            user_mention: userMention(member?.user.id!),
                            ns: 'modules',
                        }),
                    ),
                ],
                ephemeral: true,
            });
        const settings = await client.db.guild.findUnique({
            where: { guildId: guildId },
            select: { verification: true, joinGate: true },
        });
        if (!settings)
            return interaction.reply({
                embeds: [embed.setDescription(i18next.t('verification.start.failedToGetData', { ns: 'modules' }))],
                ephemeral: true,
            });
        if (!settings.verification)
            return interaction.reply({
                embeds: [embed.setDescription(i18next.t('verification.start.failedToGetData', { ns: 'modules' }))],
                ephemeral: true,
            });
        if (!settings.verification.isEnabled)
            return interaction.reply({
                embeds: [embed.setDescription(i18next.t('verification.start.moduleIsTurnedOff', { ns: 'modules' }))],
                ephemeral: true,
            });

        const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({
                size: 60,
                color: '#ffffff',
            })
            .setDecoy({ opacity: 0.5 })
            .setTrace({ color: '#ffffff' });
        const attachment = new AttachmentBuilder(captcha.generateSync(), {
            name: 'captcha.png',
            description: 'Captcha verification image.',
        });

        await interaction.reply({
            embeds: [embed.setDescription(i18next.t('verification.start.sentDMToUser', { ns: 'modules' }))],
            ephemeral: true,
        });
        await fetchedMember
            .send({
                embeds: [
                    embed
                        .setDescription(
                            i18next.t('verification.start.captchaMessage.description', {
                                guild_name: guild.name,
                                ns: 'modules',
                            }),
                        )
                        .addFields({
                            name: i18next.t('verification.start.captchaMessage.fields.name', { ns: 'modules' }),
                            value: [
                                i18next.t('verification.start.captchaMessage.fields.value1', { ns: 'modules' }),
                                i18next.t('verification.start.captchaMessage.fields.value2', { ns: 'modules' }),
                                i18next.t('verification.start.captchaMessage.fields.value3', { ns: 'modules' }),
                                i18next.t('verification.start.captchaMessage.fields.value4', { ns: 'modules' }),
                            ].join('\n'),
                        })
                        .setImage(`attachment://captcha.png`),
                ],
                files: [attachment],
            })
            .catch(() => {
                return interaction.reply({
                    embeds: [
                        embed
                            .setDescription(
                                i18next.t('verification.start.disabledDirectMessages', {
                                    guild_name: guild.name,
                                    ns: 'modules',
                                }),
                            )
                            .setFields(),
                    ],
                    ephemeral: true,
                });
            });

        const filter = (msg: Message) => msg.author.id === fetchedMember.id;
        const collector = fetchedMember.dmChannel?.createMessageCollector({
            filter,
            time: 120000,
            max: 3,
        });

        let attempts: number = 0;
        collector?.on('collect', async (msg: Message) => {
            attempts++;
            const memberInput = msg.content.toLowerCase();

            if (memberInput === captcha.text?.toLowerCase()) {
                const roleAddIds = settings.verification?.rolesToAddOnVerification ?? [];
                const roleRemoveIds = settings.verification?.rolesToRemoveOnVerification ?? [];
                const rolesToAdd = Array.isArray(roleAddIds)
                    ? (roleAddIds.map((roleId) => guild.roles.cache.get(roleId)).filter(Boolean) as Role[])
                    : [];
                const rolesToRemove = Array.isArray(roleRemoveIds)
                    ? (roleRemoveIds.map((roleId) => guild.roles.cache.get(roleId)).filter(Boolean) as Role[])
                    : [];

                try {
                    if (rolesToAdd.length > 0) {
                        await fetchedMember.roles.add(rolesToAdd);
                    }

                    if (rolesToRemove.length > 0) {
                        await fetchedMember.roles.remove(rolesToRemove);
                    }

                    if (settings.verification?.welcomeOnVerification && settings.verification.welcomeOnVerificationChannel) {
                        const welcomeChannel = guild.channels.cache.get(
                            settings.verification.welcomeOnVerificationChannel,
                        ) as TextChannel;

                        const guildOwner = await guild.fetchOwner();

                        let welcomeMessage = settings.verification.welcomeOnVerificationMessage
                            .replaceAll('{{user}}', `${userMention(fetchedMember.user.id)}`)
                            .replaceAll('{{user_name}}', `${fetchedMember.user.username}`)
                            .replaceAll('{{user_id}}', `${fetchedMember.user.id}`)
                            .replaceAll('{{user_displayName}}', `${fetchedMember.displayName}`)
                            .replaceAll('{{server_name}}', `${guild.name}`)
                            .replaceAll('{{server_id}}', `${guild.id}`)
                            .replaceAll('{{server_membercount}}', `${guild.memberCount}`)
                            .replaceAll('{{server_owner}}', `${userMention(guildOwner.user.id)}`)
                            .replaceAll('{{server_owner_name}}', `${guildOwner.user.username}`)
                            .replaceAll('{{server_owner_id}}', `${guildOwner.user.id}`)
                            .replaceAll('{{server_owner_displayName}}', `${guildOwner.displayName}`);

                        await sendEmbedLogMessage(
                            guild,
                            welcomeChannel.id,
                            `${client.user?.username}`,
                            embed.setDescription(welcomeMessage),
                            client,
                        );
                    }
                    fetchedMember.send({
                        embeds: [
                            embed
                                .setDescription(
                                    i18next.t('verification.start.verificationPassed', {
                                        guild_name: guild.name,
                                        ns: 'modules',
                                    }),
                                )
                                .setFields(),
                        ],
                    });
                } catch (error) {
                    fetchedMember.send({
                        embeds: [
                            embed
                                .setDescription(i18next.t('verification.start.failedToFindRole', { ns: 'modules' }))
                                .setFields(),
                        ],
                    });
                    collector.stop();
                    logger.error('Error handling roles:', error);
                }

                if (attempts <= 2) {
                    collector.stop();
                }
            } else if (attempts >= 3) {
                fetchedMember
                    .send({
                        embeds: [
                            embed
                                .setDescription(
                                    i18next.t('verification.start.failedToPassVerification', { ns: 'modules' }),
                                )
                                .setFields(),
                        ],
                    })
                    .then(() => {
                        fetchedMember.kick(
                            i18next.t('verification.start.kickReason', {
                                user_global_name: fetchedMember.user.globalName ?? fetchedMember.user.username,
                                ns: 'modules',
                            }),
                        );
                    });
            } else {
                fetchedMember.send({
                    embeds: [
                        embed
                            .setDescription(i18next.t('verification.start.wrongCaptchaCode', { ns: 'modules' }))
                            .setFields(),
                    ],
                });
            }
        });
    },
};

export default button;
