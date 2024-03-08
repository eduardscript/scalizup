import { dev } from '$app/environment';
import adapter from '$lib/db/adapter';
import { Lucia } from 'lucia';

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	}
});
