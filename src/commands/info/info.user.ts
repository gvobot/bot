import { DiscordClient } from '../../bot.js';
import { SubCommand } from '../../components/typings/index.js';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits, userMention } from 'discord.js';
import { getGuildTheme, getFooter } from '../../components/helpers/exports.js';
import i18next from '../../components/handlers/i18n.js';

function addSuffix(number: number) {
    if (number % 100 >= 11 && number % 100 <= 13) return number + 'th';

    switch (number % 10) {
        case 1:
            return number + 'st';
        case 2:
            return number + 'nd';
        case 3:
            return number + 'th';
    }
    return number + 'th';
}

const command: SubCommand = {
    subCommand: 'info.user',
    execute: async (interaction: ChatInputCommandInteraction, client: DiscordClient) => {
        const { guild, guildId, options } = interaction;
        if (!guild) return;
        if (!guildId) return;

        let embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        await getFooter(guild, client, embed);

        const user = options.getUser('user');
        if (!user) return;

        try {
            const fetchedMembers = await guild.members.fetch();

            let memberDescription: string = '';
            let memberFields: string[] = [];

            if (guild.members.cache.has(user.id)) {
                const member = guild.members.cache.get(user.id);

                const joinTime = parseInt(String(member?.joinedTimestamp! / 1000));

                const joinPosition =
                    Array.from(
                        fetchedMembers
                            .sort((a: GuildMember, b: GuildMember) => a.joinedTimestamp! - b.joinedTimestamp!)
                            .keys(),
                    ).indexOf(member?.id!) + 1;

                const topRoles = member?.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .map((role) => role)
                    .slice(0, 3);

                memberDescription = i18next.t('info.user.embed.memberInformation.description', {
                    joinPosition: addSuffix(joinPosition),
                    ns: 'commands',
                });
                memberFields = [
                    i18next.t('info.user.embed.memberInformation.nickname', { ns: 'commands' }) + `${member?.nickname ?? i18next.t('info.user.embed.memberInformation.noNickname', { ns: 'commands' })}`,
                    i18next.t('info.user.embed.memberInformation.joined', { ns: 'commands' }) + `<t:${joinTime}:R>`,
                    i18next.t('info.user.embed.memberInformation.topRoles', { ns: 'commands' }) + topRoles,
                ];
            } else {
                memberDescription = ' ';
                memberFields = [i18next.t('info.user.embed.memberInformation.notMember', { ns: 'commands' })];
            }

            const createdTime = parseInt(String(user.createdTimestamp / 1000));

            return interaction.reply({
                embeds: [
                    embed
                        .setAuthor({
                            name: i18next.t('info.user.embed.author', {
                                user_username: user?.username,
                                ns: 'commands',
                            }),
                        })
                        .setDescription(memberDescription)
                        .addFields([
                            {
                                name: i18next.t('info.user.embed.userInformation.name', { ns: 'commands' }),
                                value: [
                                    i18next.t('info.user.embed.userInformation.identifier', { ns: 'commands' }) + user.id,
                                    i18next.t('info.user.embed.userInformation.username', { ns: 'commands' }) +
                                        user.username,
                                    i18next.t('info.user.embed.userInformation.created', { ns: 'commands' }) +
                                        `<t:${createdTime}:R>`,
                                ].join('\n'),
                            },
                            {
                                name: i18next.t('info.user.embed.memberInformation.name', { ns: 'commands' }),
                                value: memberFields.join('\n'),
                            },
                        ]),
                ],
                ephemeral: false,
            });
        } catch (error) {
            console.log(error);
        }
    },
};

export default command;
