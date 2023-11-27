import { SlashCommandBuilder, ClientEvents, PermissionFlagsBits, ColorResolvable } from 'discord.js';

export type ObjectNameIDArray = Array[{ name: string; id: string }];
export type WebhookArray = Array[{ name: string; url: string }];
export type GuildArray = Array[{ name: string; category: string; id: string }];

export interface ConfigInterface {
    bot: {
        token: string;
        id: string;
        secret: string;
    };
    avatars: {
        default: string;

        // Event Avatars
        snowman: string;
        rabbit: string;
        jack_o_lantern: string;
        star2: string;
        gift_heart: string;
    };
    webhooks: WebhookArray;
    guilds: GuildArray;
    colors: Object[ColorResolvable];
}

export interface EventInterface {
    name: keyof ClientEvents
    options: { rest: boolean; once: boolean };
    execute: (...args: any[]) => any;
}

export interface CommandInterface {
    cooldown?: number;
    subCommand?: string;
    data: SlashCommandBuilder | any;
    execute: (...args: any[]) => any;
}

export interface SubCommandInterface {
    cooldown?: number;
    subCommand?: string;
    data: SlashCommandBuilder | any;
}

export interface SubCommand {
    subCommand: string;
    execute: (...args: any[]) => any;
}
