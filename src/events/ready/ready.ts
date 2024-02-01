import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events } from 'discord.js';
import { logger } from '../../components/handlers/exports.js';
import DLU from '@dbd-soft-ui/logs';
import os from 'os';

const event: EventInterface = {
    name: Events.ClientReady,
    options: { once: true, rest: false },
    execute: async (client: DiscordClient) => {
        let dashboard: boolean = false;
        if (client.config.bot.dashboard) {
            DLU.register(client, {
                dashboard_url: client.config.bot.dashboard.url,
                key: client.config.bot.dashboard.url,
            });
            dashboard = true;
        } else {
            dashboard = false;
        }

        const commandCount = client.commands.size;
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const totalGuilds = client.guilds.cache.size;

        function displayLog() {
            console.clear();
            console.log('==================================');
            console.log('Bot Status Console');
            console.log('==================================');
            console.log(`Command Count: ${commandCount}`);
            console.log(`Total Members: ${totalMembers}`);
            console.log(`Total Guilds: ${totalGuilds}`);
            console.log(`Bot Launch Time: ${new Date().toLocaleString()}`);
            console.log(`Storage Used: ${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)} MB`);
            console.log(`Total RAM: ${Math.round(os.totalmem() / 1024 / 1024)} MB`);
            console.log(`CPU: ${os.cpus()[0].model}`);
            console.log(`Dashboard: ${dashboard}`);
            console.log('==================================');
        }

        displayLog();
    },
};
export default event;
