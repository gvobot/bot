import { DiscordClient } from '../../bot.js';
import { SubCommand } from '../../components/typings/index.js';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { getGuildTheme, getFooter, checkForPermission, RoleType } from '../../components/helpers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const command: SubCommand = {
    subCommand: 'mod.mute',
    execute: async (interaction: ChatInputCommandInteraction, client: DiscordClient) => {
        const { guild, guildId, member } = interaction;
        if (!guild) return;
        if (!guildId) return;
        if (!member) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        await getFooter(guild, client, embed);

        const isHelper = await checkForPermission(member as GuildMember, RoleType.Helper);
        if (!isHelper)
            return interaction.reply({
                embeds: [embed.setDescription('You do not have the required permissions.')],
                ephemeral: true,
            });
        return interaction.reply({
            embeds: [embed.setDescription('You do have the required permissions.')],
            ephemeral: true,
        });
    },
};

export default command;
