// import { DiscordClient } from '../../bot.js';
import { defaultLanguage } from "../../config.js";
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
    const guildSettings = await prisma.guild.findUnique({ where: { guildId: guild.id } });
    return guildSettings?.language ?? defaultLanguage;
}

export async function changeLanguage(lng: string) {
    if (Object.keys(languages).includes(lng)) {
        return i18next.changeLanguage(lng);
    }
}

export async function loadLanguageForGuild(guild: Guild) {
    const guildSettings = await prisma.guild.findUnique({ where: { guildId: guild.id } });
    const lng = guildSettings?.language ?? defaultLanguage;
    await changeLanguage(lng);
}
