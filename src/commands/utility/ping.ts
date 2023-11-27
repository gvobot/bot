import { DiscordClient } from '../../bot.js';
import { CommandInterface } from '../../components/typings/index.js';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { logger, slashCommandTranslate } from '../../components/handlers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const command: CommandInterface = {
    data: new SlashCommandBuilder()
        .setName(i18next.t('ping.name', { ns: 'commands' }))
        .setNameLocalizations(slashCommandTranslate('ping.name', 'commands'))
        .setNSFW(false)
        .setDescription(i18next.t('ping.description', { ns: 'commands' }))
        .setDescriptionLocalizations(slashCommandTranslate('ping.description', 'commands'))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    execute: async (interaction: ChatInputCommandInteraction, client: DiscordClient) => {
        return interaction.reply({ content: `Pong! 🏓`, ephemeral: true });
    },
};
export default command;
