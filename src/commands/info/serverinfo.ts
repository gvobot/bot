import { DiscordClient } from '../../bot.js';
import { CommandInterface } from '../../components/typings/index.js';
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
    userMention,
} from 'discord.js';
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
import { slashCommandTranslate } from '../../components/handlers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const command: CommandInterface = {
    data: new SlashCommandBuilder()
        .setName(i18next.t('serverinfo.name', { ns: 'commands' }))
        .setNameLocalizations(slashCommandTranslate('serverinfo.name', 'commands'))
        .setNSFW(false)
        .setDescription(i18next.t('serverinfo.description', { ns: 'commands' }))
        .setDescriptionLocalizations(slashCommandTranslate('serverinfo.description', 'commands'))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
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
                        name: i18next.t('serverinfo.embed.author', { guild_name: guild.name, ns: 'commands' }),
                    })
                    .addFields(
                        {
                            name: i18next.t('serverinfo.embed.serverinformation.name', { ns: 'commands' }),
                            value: [
                                i18next.t('serverinfo.embed.serverinformation.value1', {
                                    guild_id: guild.id,
                                    ns: 'commands',
                                }),
                                i18next.t('serverinfo.embed.serverinformation.value2', { ns: 'commands' }) +
                                    userMention(guild.ownerId),
                                i18next.t('serverinfo.embed.serverinformation.value3', {
                                    ns: 'commands',
                                }) +
                                    `<t:${Math.floor(guild.createdTimestamp / 1000)}:f> - <t:${Math.floor(
                                        guild.createdTimestamp / 1000,
                                    )}:R>`,
                            ].join('\n'),
                        },
                        {
                            name: i18next.t('serverinfo.embed.members.name', { ns: 'commands' }),
                            value: [
                                i18next.t('serverinfo.embed.members.value1', {
                                    guild_totalMembers: getTotalMembers(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('serverinfo.embed.members.value2', {
                                    guild_totalHumanMembers: getHumanMembers(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('serverinfo.embed.members.value3', {
                                    guild_bots: getBotMembers(guild),
                                    ns: 'commands',
                                }),
                            ].join('\n'),
                        },
                        {
                            name: i18next.t('serverinfo.embed.newMembers.name', { ns: 'commands' }),
                            value: [
                                i18next.t('serverinfo.embed.newMembers.value1', {
                                    guild_lastMembers12Months: getMembersJoinedLast12Months(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('serverinfo.embed.newMembers.value2', {
                                    guild_lastMembers6Months: getMembersJoinedLast6Months(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('serverinfo.embed.newMembers.value3', {
                                    guild_lastMembers30Days: getMembersJoinedLast30Days(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('serverinfo.embed.newMembers.value4', {
                                    guild_lastMembers7days: getMembersJoinedLast7Days(guild),
                                    ns: 'commands',
                                }),
                                i18next.t('serverinfo.embed.newMembers.value5', {
                                    guild_lastMembers24hrs: getMembersJoinedLast24Hours(guild),
                                    ns: 'commands',
                                }),
                            ].join('\n'),
                        },
                    ),
            ],
        });
    },
};
export default command;
