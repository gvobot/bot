import { DiscordClient } from '../../bot.js';
import { EventInterface, CommandInterface } from '../../components/typings/index.js';
import { logger } from '../../components/handlers/exports.js';
import { getGuildTheme, getFooter } from '../../components/helpers/exports.js';
import { Events, ChatInputCommandInteraction, Collection, EmbedBuilder } from 'discord.js';
import i18next from '../../components/handlers/i18n.js';

const event: EventInterface = {
    name: Events.InteractionCreate,
    options: { once: false, rest: false },
    execute: async (interaction: ChatInputCommandInteraction, client: DiscordClient) => {
        const { guild, guildId } = interaction;
        if (!guild) return;
        if (!guildId) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        await getFooter(guild, client, embed);

        if (!interaction.isChatInputCommand()) return;

        const command: CommandInterface | undefined = client.commands.get(interaction.commandName);
        if (!command) {
            logger.error('Failed to process this command', command);
            return interaction.reply({
                content: i18next.t('interactionCreate.command.failedToProcess', { ns: 'events' }),
                ephemeral: true,
            });
        }

        /**
         * Cooldown
         */
        const { cooldowns } = client;
        const defaultCooldownDuration = 5;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }
        let timestamps = cooldowns.get(command.data.name);
        if (!timestamps) {
            timestamps = new Collection<string, number>();
            cooldowns.set(command.data.name, timestamps);
        }

        const now = Date.now();
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
        if (timestamps?.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({
                    embeds: [
                        embed.setDescription(
                            i18next.t('interactionCreate.command.cooldown', {
                                ns: 'events',
                                commandName: command.data.name,
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

        const subcommand = interaction.options.getSubcommand(false);
        try {
            if (subcommand) {
                const subCommandFile = client.subcommands.get(`${interaction.commandName}.${subcommand}`);
                subCommandFile?.execute(interaction, client);
            } else {
                command.execute(interaction, client);
            }
        } catch (error) {
            logger.error('Failed to process this command', error);
            return interaction.reply({
                content: i18next.t('interactionCreate.command.failedToProcess', { ns: 'events' }),
            });
        }
    },
};
export default event;
