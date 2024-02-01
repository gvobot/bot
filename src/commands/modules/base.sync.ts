import { SubCommandInterface } from '../../components/typings/index.js';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { slashCommandTranslate } from '../../components/handlers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const command: SubCommandInterface = {
    data: new SlashCommandBuilder()
        .setName(i18next.t('sync.name', { ns: 'commands' }))
        .setNameLocalizations(slashCommandTranslate('sync.name', 'commands'))
        .setNSFW(false)
        .setDescription(i18next.t('sync.description', { ns: 'commands' }))
        .setDescriptionLocalizations(slashCommandTranslate('sync.description', 'commands'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
            subcommand
                .setName(i18next.t('sync.verification.name', { ns: 'commands' }))
                .setNameLocalizations(slashCommandTranslate('sync.verification.name', 'commands'))
                .setDescription(i18next.t('sync.verification.description', { ns: 'commands' }))
                .setDescriptionLocalizations(slashCommandTranslate('sync.verification.description', 'commands')),
        ),
};

export default command;
