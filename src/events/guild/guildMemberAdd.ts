import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events, EmbedBuilder, GuildMember } from 'discord.js';
import { getGuildTheme, getFooter } from '../../components/helpers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const event: EventInterface = {
    name: Events.GuildMemberAdd,
    options: { once: false, rest: false },
    execute: async (member: GuildMember, client: DiscordClient) => {
        const { guild } = member;
        if (!guild) return;
        if (!member) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        await getFooter(guild, client, embed);

        
    },
};

export default event;
