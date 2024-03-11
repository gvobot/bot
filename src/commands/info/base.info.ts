import { SubCommandInterface } from '../../components/typings/index.js';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { slashCommandTranslate } from '../../components/handlers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const command: SubCommandInterface = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(i18next.t('info.name', { ns: 'commands' }))
        .setNameLocalizations(slashCommandTranslate('info.name', 'commands'))
        .setNSFW(false)
        .setDescription(i18next.t('info.description', { ns: 'commands' }))
        .setDescriptionLocalizations(slashCommandTranslate('info.description', 'commands'))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
            subcommand
                .setName(i18next.t('info.guild.name', { ns: 'commands' }))
                .setNameLocalizations(slashCommandTranslate('info.guild.name', 'commands'))
                .setDescription(i18next.t('info.guild.description', { ns: 'commands' }))
                .setDescriptionLocalizations(slashCommandTranslate('info.guild.description', 'commands')),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(i18next.t('info.user.name', { ns: 'commands' }))
                .setNameLocalizations(slashCommandTranslate('info.user.name', 'commands'))
                .setDescription(i18next.t('info.user.description', { ns: 'commands' }))
                .setDescriptionLocalizations(slashCommandTranslate('info.user.description', 'commands'))
                .addUserOption((options) =>
                    options
                        .setName(i18next.t('info.user.user.name', { ns: 'commands' }))
                        .setNameLocalizations(slashCommandTranslate('info.user.user.name', 'commands'))
                        .setDescription(i18next.t('info.user.user.description', { ns: 'commands' }))
                        .setDescriptionLocalizations(slashCommandTranslate('info.user.user.description', 'commands'))
                        .setRequired(true),
                ),
        ),
};

export default command;
