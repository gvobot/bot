import { DiscordClient } from "../../bot.js";
import { logger } from "../../components/handlers/exports.js";
import { EventInterface } from "../../components/typings/index.js";
import { Events, Guild } from "discord.js";
import { defaultLanguage } from '../../config.js';

const event: EventInterface = {
  name: Events.GuildCreate,
  options: { once: false, rest: false },
  execute: async (
    guild: Guild,
    client: DiscordClient
  ) => {
    try {
        const existingGuild = await client.db.guild.findUnique({where :{guildId: guild.id}})
        if(!existingGuild) {
            await client.db.guild.create({data: {
                guildId: guild.id, 
                language: defaultLanguage,
                themeColor: client.config.colors.theme,
                isMembership: false
            }})
            logger.info(`Guild ${guild.name} (${guild.id}) registered in the database.`);
        }
    } catch (error) {
        logger.error('Error registering guild:', error);
    }
  },
};
export default event;
