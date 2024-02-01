import { DiscordClient } from '../../bot.js';
import { ButtonInterface } from '../typings/index.js';

import { fileURLToPath, pathToFileURL } from 'node:url';
import path, { dirname } from 'node:path';
import { readdirSync } from 'node:fs';

export async function loadButtons(client: DiscordClient) {
    const buttonsFolder = path.resolve(dirname(fileURLToPath(import.meta.url)), '../', '../buttons');

    await Promise.all(
        readdirSync(buttonsFolder).map(async (folder) => {
            await Promise.all(
                readdirSync(path.join(buttonsFolder, folder))
                    .filter((file) => file.endsWith('.js'))
                    .map(async (file) => {
                        const button: ButtonInterface = (
                            await import(pathToFileURL(path.resolve(buttonsFolder, folder, file)).toString())
                        ).default;

                        client.buttons.set(button.customId, button);
                    }),
            );
        }),
    );
}
