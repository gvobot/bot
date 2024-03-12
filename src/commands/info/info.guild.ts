import { DiscordClient } from '../../bot.js';
import { SubCommand } from '../../components/typings/index.js';
import { ChatInputCommandInteraction, EmbedBuilder, userMention } from 'discord.js';
import {
    getGuildTheme,
    getFooter,
    getTotalMembers,
    getBotMembers,
    getHumanMembers,
    getMembersJoinedLast24Hours,
    getMembersJoinedLast7Days,
    getMembersJoinedLast30Days,
    getMembersJoinedLast6Months,
    getMembersJoinedLast12Months,
} from '../../components/helpers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const command: SubCommand = {
    subCommand: 'info.guild',
    execute: async (interaction: ChatInputCommandInteraction, client: DiscordClient) => {
        const { guild, guildId } = interaction;
        if (!guild) return;
        if (!guildId) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        await getFooter(guild, client, embed);

        return interaction.reply({
            embeds: [
                embed
                    .setAuthor({
                        name: i18next.t('info.guild.embed.author', { guild_name: guild.name, ns: 'commands' }),
                    })
                    .addFields(
                        {
                            name: i18next.t('info.guild.embed.guildinformation.name', { ns: 'commands' }),
                            value: [
                                i18next.t('info.guild.embed.guildinformation.value1', {
                                    guild_id: guildId,
                                    ns: 'commands',
                                }),
                                i18next.t('info.guild.embed.guildinformation.value2', { ns: 'commands' }) +
                                    `${userMention(guild.ownerId)}`,
                                i18next.t('info.guild.embed.guildinformation.value3', { ns: 'commands' }) +
                                    `<t:${Math.floor(guild.createdTimestamp / 1000)}:f> - <t:${Math.floor(
                                        guild.createdTimestamp / 1000,
                                    )}:R>`,
                            ].join('\n'),
                        },
                        {
                            name: i18next.t('info.guild.embed.members.name', { ns: 'commands' }),
                            value: [
                                i18next.t('info.guild.embed.members.value1', {
                                    guild_totalMembers: getTotalMembers(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('info.guild.embed.members.value2', {
                                    guild_totalHumanMembers: getHumanMembers(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('info.guild.embed.members.value3', {
                                    guild_bots: getBotMembers(guild),
                                    ns: 'commands',
                                }),
                            ].join('\n'),
                        },
                        {
                            name: i18next.t('info.guild.embed.newMembers.name', { ns: 'commands' }),
                            value: [
                                i18next.t('info.guild.embed.newMembers.value1', {
                                    guild_lastMembers12Months: getMembersJoinedLast12Months(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('info.guild.embed.newMembers.value2', {
                                    guild_lastMembers6Months: getMembersJoinedLast6Months(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('info.guild.embed.newMembers.value3', {
                                    guild_lastMembers30Days: getMembersJoinedLast30Days(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('info.guild.embed.newMembers.value4', {
                                    guild_lastMembers7days: getMembersJoinedLast7Days(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('info.guild.embed.newMembers.value5', {
                                    guild_lastMembers24hrs: getMembersJoinedLast24Hours(guild),
                                    ns: 'commands',
                                }),
                            ].join('\n'),
                        },
                    ),
            ],
            ephemeral: false,
        });
    },
};

export default command;
