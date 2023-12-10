import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events } from 'discord.js';
import { logger } from '../../components/handlers/exports.js';
import DLU from "@dbd-soft-ui/logs";

const event: EventInterface = {
    name: Events.ClientReady,
    options: { once: true, rest: false },
    execute: async (client: DiscordClient) => {
        if(!client.config.bot.dashboard) return

        DLU.register(client, {
            dashboard_url: client.config.bot.dashboard.url,
            key: client.config.bot.dashboard.url
        })
        logger.info("Registered Dashboard Logs")
    },
};
export default event;
