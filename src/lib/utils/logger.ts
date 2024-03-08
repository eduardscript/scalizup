import pino, { type LoggerOptions } from 'pino';
import { dev } from '$app/environment';

const options: LoggerOptions = {};

if (dev) {
	options.transport = {
		target: 'pino-pretty'
	};
}

export const logger = pino(options);
