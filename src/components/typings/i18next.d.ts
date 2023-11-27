import type { resources, defaultNS, fallbackNS } from '../handlers/i18n.js';

declare module 'i18next' {
    type CustomTypeOptions = {
        defaultNS: typeof defaultNS;
        fallbackNS: typeof fallbackNS;
        resources: typeof resources;
    };
}
