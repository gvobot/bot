import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { EmbedBuilder, Events, Message, hyperlink } from 'discord.js';
import { getGuildTheme, getFooter } from '../../components/helpers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const event: EventInterface = {
    name: Events.MessageCreate,
    options: { once: false, rest: false },
    execute: async (message: Message, client: DiscordClient) => {
        const { guild, author } = message;
        if (!guild) return;
        if (author.bot) return;

        if (message.content.includes(client.user?.id!)) {
            const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
            await getFooter(guild, client, embed);

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
                                name: i18next.t('messageCreate.help_mention.help_support.name', { ns: 'events' }),
                                value: [
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.help_support.value1', { ns: 'events' }),
                                        'https://gvobot.app/paypal',
                                    ),
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.help_support.value2', { ns: 'events' }),
                                        'https://gvobot.app/kofi',
                                    ),
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.help_support.value3', { ns: 'events' }),
                                        'https://gvobot.app/discord',
                                    ),
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.help_support.value4', { ns: 'events' }),
                                        'https://dash.gvobot.app/',
                                    ),
                                    hyperlink(
                                        i18next.t('messageCreate.help_mention.help_support.value5', { ns: 'events' }),
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
                        ),
                ],
            });
        }
    },
};

export default event;
