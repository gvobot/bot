import { ClusterManager, HeartbeatManager } from 'discord-hybrid-sharding';
import { logger } from './components/handlers/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export const DiscordToken = process.env.DISCORD_BOT_TOKEN;

export const manager = new ClusterManager(`./dist/bot.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    // totalClusters: 7,
    mode: 'process',
    token: DiscordToken,
});

manager.extend(
    new HeartbeatManager({
        interval: 2000,
        maxMissedHeartbeats: 5,
    }),
);

manager.on('clusterCreate', (cluster) => logger.info(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });
