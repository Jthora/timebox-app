// Polyfills for jsdom environment
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';

const globalWithEncoders = globalThis as typeof globalThis & {
	TextEncoder?: typeof TextEncoder;
	TextDecoder?: typeof TextDecoder;
};

if (!globalWithEncoders.TextEncoder) {
	globalWithEncoders.TextEncoder = TextEncoder as typeof globalWithEncoders.TextEncoder;
}

if (!globalWithEncoders.TextDecoder) {
	globalWithEncoders.TextDecoder = TextDecoder as typeof globalWithEncoders.TextDecoder;
}
