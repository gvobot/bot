import { SubCommandInterface } from '../../components/typings/index.js';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { slashCommandTranslate } from '../../components/handlers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const command: SubCommandInterface = {
    cooldown: 2,
    data: new SlashCommandBuilder()
        .setName(i18next.t('mod.name', { ns: 'commands' }))
        .setNameLocalizations(slashCommandTranslate('mod.name', 'commands'))
        .setNSFW(false)
        .setDescription(i18next.t('mod.description', { ns: 'commands' }))
        .setDescriptionLocalizations(slashCommandTranslate('mod.description', 'commands'))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
            subcommand
                .setName(i18next.t('mod.ban.name', { ns: 'commands' }))
                .setNameLocalizations(slashCommandTranslate('mod.ban.name', 'commands'))
                .setDescription(i18next.t('mod.ban.description', { ns: 'commands' }))
                .setDescriptionLocalizations(slashCommandTranslate('mod.ban.description', 'commands')),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(i18next.t('mod.kick.name', { ns: 'commands' }))
                .setNameLocalizations(slashCommandTranslate('mod.kick.name', 'commands'))
                .setDescription(i18next.t('mod.kick.description', { ns: 'commands' }))
                .setDescriptionLocalizations(slashCommandTranslate('mod.kick.description', 'commands')),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(i18next.t('mod.mute.name', { ns: 'commands' }))
                .setNameLocalizations(slashCommandTranslate('mod.mute.name', 'commands'))
                .setDescription(i18next.t('mod.mute.description', { ns: 'commands' }))
                .setDescriptionLocalizations(slashCommandTranslate('mod.mute.description', 'commands')),
        ),
};

export default command;
