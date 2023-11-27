import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../typings/index.js';

import { fileURLToPath, pathToFileURL } from 'node:url';
import path, { dirname } from 'node:path';
import { readdirSync } from 'node:fs';

export async function loadEvents(client: DiscordClient) {
    const eventsFolder = path.resolve(dirname(fileURLToPath(import.meta.url)), '../', '../events');

    await Promise.all(
        readdirSync(eventsFolder).map(async (folder) => {
            await Promise.all(
                readdirSync(path.join(eventsFolder, folder))
                    .filter((file) => file.endsWith('.js'))
                    .map(async (file) => {
                        const event: EventInterface = (
                            await import(pathToFileURL(path.resolve(eventsFolder, folder, file)).toString())
                        ).default;

                        if (event.options?.once) {
                            client.once(event.name, (...args) => event.execute(...args, client));
                        } else {
                            client.on(event.name, (...args) => event.execute(...args, client));
                        }

                        client.events.set(event.name, event);
                    }),
            );
        }),
    );
}
