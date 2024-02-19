import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events, ActivityType } from 'discord.js';

const event: EventInterface = {
    name: Events.ClientReady,
    options: { once: true, rest: false },
    execute: async (client: DiscordClient) => {
        setInterval(() => setClientStatusAndAvatar(client), 24 * 60 * 60 * 1000);

        setClientStatusAndAvatar(client);
    },
};

function setClientStatusAndAvatar(client: DiscordClient) {
    if (!client) return;
    if (!client.user) return;
    const avatars = new Map([
        ['default', client.config.avatars.default],
        ['halloween', client.config.avatars.jack_o_lantern],
        ['christmas', client.config.avatars.snowman],
        ['new_year', client.config.avatars.star2],
        ['valentines', client.config.avatars.gift_heart],
    ]);

    const currentDate = new Date();
    const copenhagenTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));

    const currentMonth = copenhagenTime.getMonth() + 1;
    const currentDay = copenhagenTime.getDate();

    if (currentMonth === 10 && currentDay >= 1 && currentDay <= 31) {
        // HALLOWEEN
        client.user.setPresence({
            activities: [{ type: ActivityType.Custom, name: 'Spooky Season 👻' }],
            status: 'idle',
        });
        client.user.setAvatar(avatars.get('halloween')!);
        client.guilds.cache.get(client.config.guilds[0].id)?.setIcon(avatars.get('halloween')!);
    } else if (currentMonth === 12 && currentDay >= 1 && currentDay <= 31) {
        // CHRISTMAS
        client.user.setPresence({
            activities: [{ type: ActivityType.Custom, name: 'Merry Christmas 🎄' }],
            status: 'dnd',
        });
        client.user.setAvatar(avatars.get('christmas')!);
        client.guilds.cache.get(client.config.guilds[0].id)?.setIcon(avatars.get('christmas')!);
    } else if (currentMonth === 1 && currentDay === 1) {
        // NEW YEARS
        client.user.setPresence({
            activities: [{ type: ActivityType.Custom, name: 'Happy New Years 🎆' }],
            status: 'idle',
        });
        client.user.setAvatar(avatars.get('new_year')!);
        client.guilds.cache.get(client.config.guilds[0].id)?.setIcon(avatars.get('new_year')!);
    } else if (currentMonth === 2 && currentDay === 14) {
        // VALENTINES
        client.user.setPresence({
            activities: [{ type: ActivityType.Custom, name: 'Feeling the love ❤️' }],
            status: 'idle',
        });
        client.user.setAvatar(avatars.get('valentines')!);
        client.guilds.cache.get(client.config.guilds[0].id)?.setIcon(avatars.get('valentines')!);
    } else {
        client.user.setPresence({
            activities: [{ type: ActivityType.Custom, name: 'Give your friend a hug! 🤗' }],
            status: 'idle',
        });
        client.user.setAvatar(avatars.get('default')!);
        client.guilds.cache.get(client.config.guilds[0].id)?.setIcon(avatars.get('default')!);
    }
}

export default event;
