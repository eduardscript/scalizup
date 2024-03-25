import { dev } from '$app/environment';
import adapter from '$lib/db/adapter';
import { Lucia } from 'lucia';

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			availableTenants: JSON.parse(attributes.availableTenants) as number[],
			roles: JSON.parse(attributes.roles) as string[]
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	availableTenants: string;
	roles: string;
}
