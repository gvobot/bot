import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import { ConfigInterface, EventInterface, CommandInterface } from './components/typings/index.js';

import { loadCommands, loadEvents, logger } from './components/handlers/exports.js';

import { config } from './config.js';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class DiscordClient extends Client {
    public commands: Collection<string, CommandInterface>;
    public subcommands: Collection<string, CommandInterface>;
    public cooldowns: Collection<string, Collection<string, number>>;
    public events: Collection<string, EventInterface>;
    public config: ConfigInterface;
    public cluster: ClusterClient<DiscordClient>;
    public db: typeof prisma;
    constructor() {
        super({
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
            intents: [
                GatewayIntentBits.AutoModerationConfiguration,
                GatewayIntentBits.AutoModerationExecution,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildScheduledEvents,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User,
            ],
        });
        this.commands = new Collection();
        this.subcommands = new Collection();
        this.cooldowns = new Collection();
        this.events = new Collection();
        this.config = config;
        this.cluster = new ClusterClient(this);
        this.db = prisma;
    }
    public async loadClient() {
        this.cluster.on('ready', () => {
            loadEvents(this)
                .then(() => {
                    loadCommands(this);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
        await this.startClient();
    }
    public async startClient() {
        this.login(this.config.bot.token).catch((error) => {
            logger.error(`Failed to log into the user client.`, error);
        });
    }
}

new DiscordClient().loadClient();
