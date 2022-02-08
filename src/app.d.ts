/// <reference types="@sveltejs/kit" />

type Locales = import('$i18n/i18n-types').Locales;
type DecodedIdToken = import('firebase-admin/auth').DecodedIdToken;

interface Cookies {
	'sessionId': string;
	'csrfToken': string;
	'pref-locale': Locales;
}

interface User {
	uid: string;
	email: string;
	photoURL: string;
	displayName: string;
}

declare namespace App {
	interface Locals {
		user?: DecodedIdToken | null;
		cookies: Cookies;
		locale: Locales;
	}

	interface Platform {}

	interface Session {
		user?: User;
		locale: Locales;
		rtl: boolean;
	}

	interface Stuff {}
}
