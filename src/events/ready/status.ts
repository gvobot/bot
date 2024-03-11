import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events, ActivityType, PresenceStatusData } from 'discord.js';
import moment from 'moment-timezone';

const event: EventInterface = {
    name: Events.ClientReady,
    options: { once: true, rest: false },
    execute: async (client: DiscordClient) => {
        if (!client) return;
        if (!client.user) return;
        const config = client.config;
        const avatars = new Map([
            ['default', config.avatars.default],
            ['halloween', config.avatars.jack_o_lantern],
            ['christmas', config.avatars.snowman],
            ['new_year', config.avatars.star2],
            ['valentines', config.avatars.gift_heart],
        ]);
        let clientAvatar: string | undefined = config.avatars.default;
        let guildAvatar: string | undefined = config.avatars.default;
        let activities = [
            'Slem igen',
            'God Pige',
            'Tak For Sidst',
            'Lever Nu',
            'Fræk',
            'Varm',
            'Kinky Fætter',
            'Million På Konto',
            'Er Her',
            'Gode Dage, Gode Drinks',
        ];
        let presenceActivity: string;
        let presenceStatus: PresenceStatusData;

        const updateActivityAndAvatar = async () => {
            const now = moment.tz('Europe/Copenhagen');
            const currentMonth = now.month() + 1;
            const currentDay = now.date();

            if (currentMonth === 6 && currentDay === 7) {
                presenceActivity = "It's My Birthday! 🎉🎂";
                presenceStatus = 'idle';
            } else if (currentMonth === 11 && currentDay === 13) {
                clientAvatar = guildAvatar = avatars.get('halloween');
                presenceActivity = 'Happy Birthday DuckoDas! ❤️';
                presenceStatus = 'idle';
            } else if (currentMonth === 10 && currentDay >= 1 && currentDay <= 31) {
                clientAvatar = guildAvatar = avatars.get('halloween');
                presenceActivity = 'Spooky Season 👻';
                presenceStatus = 'idle';
            } else if (currentMonth === 12 && currentDay >= 1 && currentDay <= 31) {
                presenceActivity = 'Merry Christmas 🎄';
                clientAvatar = guildAvatar = avatars.get('christmas');
                presenceStatus = 'idle';
            } else if (currentMonth === 1 && currentDay === 1) {
                clientAvatar = guildAvatar = avatars.get('new_year');
                presenceActivity = 'Happy New Years ✨';
                presenceStatus = 'idle';
            } else if (currentMonth === 2 && currentDay === 14) {
                clientAvatar = guildAvatar = avatars.get('valentines');
                presenceActivity = 'Feeling the love';
                presenceStatus = 'dnd';
            } else {
                clientAvatar = guildAvatar = avatars.get('default');
                presenceActivity = activities[Math.floor(Math.random() * activities.length)];
                presenceStatus = 'online';
            }

            try {
                await client.user?.setAvatar(clientAvatar!);
                await client.guilds.cache.get(client.config.guilds[0].id)?.setIcon(guildAvatar!);
                client.user?.setPresence({
                    activities: [{ type: ActivityType.Custom, name: presenceActivity }],
                    status: presenceStatus,
                });
            } catch (error) {}
        };

        const now = moment.tz('Europe/Copenhagen');
        const next12AM = now.add(1, 'days').startOf('day').add(12, 'hours');
        const delay = next12AM.diff(now);
        setTimeout(() => {
            updateActivityAndAvatar(); // Initial change
            setInterval(updateActivityAndAvatar, 24 * 60 * 60 * 1000);
        }, delay);
    },
};

export default event;
