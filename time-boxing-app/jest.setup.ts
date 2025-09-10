// Polyfills for jsdom environment
import { TextEncoder, TextDecoder } from 'util';

// @ts-expect-error assign to global
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder as any;
// @ts-expect-error assign to global
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder as any;
