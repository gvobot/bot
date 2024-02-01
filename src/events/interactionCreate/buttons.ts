import { logger } from '../../components/handlers/exports.js';
import { getGuildTheme, getFooter } from '../../components/helpers/exports.js';
import { DiscordClient } from '../../bot.js';
import { ButtonInterface, EventInterface } from '../../components/typings/index.js';
import { Events, ButtonInteraction, EmbedBuilder, Collection } from 'discord.js';
import i18next from '../../components/handlers/i18n.js';

const event: EventInterface = {
    name: Events.InteractionCreate,
    options: { once: false, rest: false },
    execute: async (interaction: ButtonInteraction, client: DiscordClient) => {
        const { guild, guildId } = interaction;
        if (!guild) return;
        if (!guildId) return;

        if (!interaction.isButton()) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        await getFooter(guild, client, embed);

        let button: ButtonInterface | undefined = client.buttons.get(interaction.customId);
        if (!button) {
            logger.error('Failed to process this button', button);
            return interaction.reply({
                embeds: [embed.setDescription(i18next.t('interactionCreate.button.failedToProcess', { ns: 'events' }))],
                ephemeral: true,
            });
        }

        /**
         * Permission Check
         */
        if (button.permissions && !interaction.memberPermissions?.has(button.permissions)) {
            return interaction.reply({
                embeds: [
                    embed.setDescription(i18next.t('interactionCreate.button.missingPermissions', { ns: 'events' })),
                ],
                ephemeral: true,
            });
        }

        /**
         * InteractionOnly
         */
        if (button.interactionAuthorOnly && interaction.user.id !== interaction.message.interaction?.user.id) {
            return interaction.reply({
                embeds: [
                    embed.setDescription(i18next.t('interactionCreate.button.interactionAuthorOnly', { ns: 'events' })),
                ],
                ephemeral: true,
            });
        }

        /**
         * Cooldown
         */
        const { cooldowns } = client;
        const defaultCooldownDuration = 5;
        if (!cooldowns.has(button.customId)) {
            cooldowns.set(button.customId, new Collection());
        }
        let timestamps = cooldowns.get(button.customId);
        if (!timestamps) {
            timestamps = new Collection<string, number>();
            cooldowns.set(button.customId, timestamps);
        }

        const now = Date.now();
        const cooldownAmount = (button.cooldown ?? defaultCooldownDuration) * 1000;
        if (timestamps?.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({
                    embeds: [
                        embed.setDescription(
                            i18next.t('interactionCreate.button.cooldown', {
                                ns: 'events',
                                expiredTimestamp: expiredTimestamp,
                            }),
                        ),
                    ],
                    ephemeral: true,
                });
            }
        }

        timestamps?.set(interaction.user.id, now);
        setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);

        button.execute(interaction, client)
    },
};
export default event;
