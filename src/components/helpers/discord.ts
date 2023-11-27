import { DiscordClient } from '../../bot.js';
import { TextChannel, WebhookClient, Guild, EmbedBuilder, ColorResolvable } from 'discord.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 *
 * @param guild
 * @param channelId
 * @param webhookName
 * @param embed
 * @param client
 */
export async function sendEmbedLogMessage(
    guild: Guild,
    channelId: string,
    webhookName: string,
    embed: EmbedBuilder,
    client: DiscordClient,
) {
    const channel = guild.channels.cache.get(channelId) as TextChannel;
    if (channel) {
        const webhook = await getWebhook(channel, webhookName);
        webhook.send({
            embeds: [embed],
            username: client.user?.username,
            avatarURL: client.user?.displayAvatarURL(),
        });
    }
}

/**
 *
 * @param channel
 * @param webhookName
 * @returns {WebhookClient}
 */
export async function getWebhook(channel: TextChannel, webhookName: string): Promise<WebhookClient> {
    const webhooks = await channel.fetchWebhooks();
    const existingWebhook = webhooks.find((wh) => wh.name === webhookName);

    if (existingWebhook) {
        return new WebhookClient({ url: existingWebhook.url });
    } else {
        const webhook = await channel.createWebhook({ name: webhookName });
        return new WebhookClient({ url: webhook.url });
    }
}

/**
 *
 * @param guild
 * @param client
 * @returns {ColorResolvable}
 */
export async function getGuildTheme(guild: Guild, client: DiscordClient): Promise<ColorResolvable> {
    const guildSettings = await prisma.guild.findUnique({ where: { guildId: guild.id } });
    return guildSettings?.themeColor ?? client.config.colors.theme;
}

/**
 *
 * @param guild
 * @param client
 * @param embed
 * @returns {EmbedBuilder | void}
 */
export async function getFooter(
    guild: Guild,
    client: DiscordClient,
    embed: EmbedBuilder,
): Promise<EmbedBuilder | null> {
    const guildSettings = await prisma.guild.findUnique({ where: { guildId: guild.id } });
    if (guildSettings?.isMembership) {
        return null;
    } else {
        return embed.setFooter({
            text: 'Support us @ gvobot.app/kofi',
            iconURL: client.user?.displayAvatarURL() ?? undefined,
        });
    }
}

/**
 *
 * @param client
 * @returns {number}
 */
export async function getUsersCount(client: DiscordClient): Promise<number> {
    try {
        const results = await client.cluster.broadcastEval('this.users.cache.size');
        return results.reduce((prev, val) => prev + val, 0);
    } catch (err) {
        console.error(err);
        return 0;
    }
}

/**
 *
 * @param client
 * @returns {number}
 */
export async function getChannelsCount(client: DiscordClient): Promise<number> {
    try {
        const results = await client.cluster.broadcastEval('this.channels.cache.size');
        return results.reduce((prev, val) => prev + val, 0);
    } catch (err) {
        console.error(err);
        return 0;
    }
}

/**
 *
 * @param client
 * @returns {number}
 */
export async function getGuildsCount(client: DiscordClient): Promise<number> {
    try {
        const results = await client.cluster.broadcastEval('this.guilds.cache.size');
        return results.reduce((prev, val) => prev + val, 0);
    } catch (err) {
        console.error(err);
        return 0;
    }
}
