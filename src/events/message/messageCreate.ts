import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { EmbedBuilder, Events, Message, hyperlink, userMention } from 'discord.js';
import { getGuildTheme, getFooter } from '../../components/helpers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const event: EventInterface = {
    name: Events.MessageCreate,
    options: { once: false, rest: false },
    execute: async (message: Message, client: DiscordClient) => {
        const { guild, author } = message;
        if (!guild) return;
        if (author.bot) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        await getFooter(guild, client, embed);

        if (guild.id === '109721206449569792') {
            if (message.content === '!spurgt') {
                if (message.content === '!spurgt') {
                    message.delete();
                }
                message.channel.send({
                    content: userMention('249204260661755904'),
                    embeds: [
                        embed.setImage(
                            'https://raw.githubusercontent.com/gvobot/branding/main/images/oliver-spurgt.png',
                        ),
                    ],
                });
            }
            if (message.content === '!selvtillid') {
                if (message.content === '!selvtillid') {
                    message.delete();
                }
                message.channel.send({
                    embeds: [
                        embed
                            .setAuthor({
                                name: `Visere ord er aldrig blevet sagt før - Mikkel`,
                                iconURL:
                                    'https://cdn.discordapp.com/avatars/965586576161771560/853ed39597b0275c0cf5dc017f12b483.webp?size=4096',
                            })
                            .setImage(
                                'https://raw.githubusercontent.com/gvobot/branding/main/images/lavere-selvtillid-end-normalt.png',
                            ),
                    ],
                });
            }
        }
        if (message.content.includes(client.user?.id!)) {
            return message.reply({
                embeds: [
                    embed
                        .setAuthor({
                            name: i18next.t('messageCreate.help_mention.author', {
                                client_user_name: client.user?.username,
                                ns: 'events',
                            }),
                        })
                        .addFields(
                            {
                                name: i18next.t('messageCreate.help_mention.legal.name', { ns: 'events' }),
                                value: [
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.legal.value1', { ns: 'events' }),
                                        'https://gvobot.app/terms',
                                    ),
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.legal.value2', { ns: 'events' }),
                                        'https://gvobot.app/privacy',
                                    ),
                                ].join('\n'),
                            },
                            {
                                name: i18next.t('messageCreate.help_mention.support.name', { ns: 'events' }),
                                value: [
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.support.value1', { ns: 'events' }),
                                        'https://gvobot.app/discord',
                                    ),
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.support.value2', { ns: 'events' }),
                                        'https://dash.gvobot.app/',
                                    ),
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.support.value3', { ns: 'events' }),
                                        'https://dash.gvobot.app/commands',
                                    ),
                                ].join('\n'),
                            },
                            {
                                name: i18next.t('messageCreate.help_mention.development_contribute.name', {
                                    ns: 'events',
                                }),
                                value: [
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.development_contribute.value1', {
                                            ns: 'events',
                                        }),
                                        'https://github.com/users/duckodas/projects/1',
                                    ),
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.development_contribute.value2', {
                                            ns: 'events',
                                        }),
                                        'https://crowdin.com/project/gvobot',
                                    ),
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.development_contribute.value3', {
                                            ns: 'events',
                                        }),
                                        'https://github.com/gvobot/discord',
                                    ),
                                ].join('\n'),
                            },
                            {
                                name: i18next.t('messageCreate.help_mention.donate.name', {
                                    ns: 'events',
                                }),
                                value: [
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.donate.value1', {
                                            ns: 'events',
                                        }),
                                        'https://coffeebots.xyz/store',
                                    ),
                                ].join('\n'),
                            },
                        ),
                ],
            });
        }
    },
};

export default event;
