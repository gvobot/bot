// import { DiscordClient } from '../../bot.js';
import { defaultLanguage } from '../../config.js';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { readdirSync } from 'node:fs';

import { Guild, Locale } from 'discord.js';
import { languages } from '../typings/languages.js';

import i18next from 'i18next';
import type { FsBackendOptions } from 'i18next-fs-backend';
import FsBackend from 'i18next-fs-backend';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { logger } from './exports.js';

await i18next.use(FsBackend).init<FsBackendOptions>({
    fallbackLng: defaultLanguage,
    returnEmptyString: false,
    backend: {
        loadPath: `locales/{{lng}}/{{ns}}.json`,
    },
});

const rootFolderPath = dirname(fileURLToPath(import.meta.url));
const locales = readdirSync(path.resolve(rootFolderPath, '..', '..', '..', 'locales'));
const namespaces = readdirSync(path.resolve(rootFolderPath, '..', '..', '..', 'locales', defaultLanguage));
for (const ns of namespaces) {
    namespaces[namespaces.indexOf(ns)] = ns.split('.')[0];
}

await i18next.loadNamespaces(namespaces);
await i18next.loadLanguages(locales);

export { default } from 'i18next';

export function slashCommandTranslate(key: string, ns: string) {
    const translation: { [index: string]: string } = {};
    const locales = Object.values(Locale);

    for (const locale of locales) {
        translation[locale] = i18next.t(key, { ns, lng: locale });
    }

    return translation;
}

export async function getGuildLanguage(guild: Guild) {
    try {
        const miscellaneousSettings = await prisma.miscellaneous.findUnique({ where: { guildId: guild.id } });
        return miscellaneousSettings?.language ?? defaultLanguage;
    } catch (error) {
        logger.error(`Failed to fetch guild settings for guild ${guild.name}: `, error);
        return defaultLanguage;
    }
}

const guildSettingsCache: Map<string, string> = new Map();

export async function getGuildLanguages(guilds: Guild[]) {
    const guildIds = guilds.map((guild) => guild.id);
    const languages: Record<string, string> = {};

    for (const guildId of guildIds) {
        if (guildSettingsCache.has(guildId)) {
            languages[guildId] = guildSettingsCache.get(guildId) ?? defaultLanguage;
        } else {
            try {
                const miscellaneousSettings = await prisma.miscellaneous.findUnique({ where: { guildId } });
                const language = miscellaneousSettings?.language ?? defaultLanguage;
                languages[guildId] = language;
                guildSettingsCache.set(guildId, language);
            } catch (error) {
                logger.error(`Failed to fetch guild settings for guild ${guildId}: `, error);
                languages[guildId] = defaultLanguage;
            }
        }
    }

    return languages;
}

export async function changeLanguage(lng: string) {
    if (Object.keys(languages).includes(lng)) {
        return i18next.changeLanguage(lng);
    }
}

export async function loadLanguageForGuilds(guilds: Guild[]) {
    for (const guild of guilds) {
        try {
            const existingGuild = await prisma.miscellaneous.findUnique({ where: { guildId: guild.id } });
            if (!existingGuild) {
                // If the guild does not exist in the database, create it
                await prisma.guild.upsert({
                    where: { guildId: guild.id },
                    create: {
                        guildId: guild.id,
                        isPremium: false,
                        miscellaneous: {
                            create: {
                                language: defaultLanguage,
                                themeColor: '#2b2d31',
                                managerRoles: [],
                                administratorRoles: [],
                                moderatorRoles: [],
                                helperRoles: [],
                            },
                        },
                    },
                    update: {
                        miscellaneous: {
                            update: {
                                language: defaultLanguage,
                            },
                        },
                    },
                });
            } else {
                const lng = existingGuild.language ?? defaultLanguage;
                await changeLanguage(lng);
            }
        } catch (error) {
            logger.error(`Failed to handle guild ${guild.name}: `, error);
        }
    }
}
