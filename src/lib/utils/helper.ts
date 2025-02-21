import { getContext } from 'svelte';
import { MODAL, PRODUCT_MODAL } from './constants';

import type { StripeContext } from 'types/index';
import type { Product } from 'types/product';

const API = 'http://localhost:3333';

export async function fetchFromAPI(endpointURL: string, opt?: Object) {
	const { method, body, ...rest } = {
		method: 'POST',
		body: null as Object | null,
		...opt,
	};

	// const customer = auth.currentUser;
	// const token = customer && (await customer.getIdToken());

	const res = await fetch(`${API}/${endpointURL}`, {
		method,
		...(body && { body: JSON.stringify(body) }),
		headers: {
			'Content-Type': 'application/json',
			// Authorization: `Bearer ${token}`,
		},
	});

	return res.json();
}

export function promiseEvent<T>(
	emitter: Element | Window,
	eventName: string,
	timeout: number
): Promise<T> {
	return new Promise((resolve, reject) => {
		let timer: number;

		function listener(data: any) {
			clearTimeout(timer);
			emitter.removeEventListener(eventName, listener);
			resolve(data);
		}

		emitter.addEventListener(eventName, listener);
		timer = window.setTimeout(() => {
			emitter.removeEventListener(eventName, listener);
			reject(new Error('timeout waiting for ' + eventName));
		}, timeout);
	});
}

export async function runAsync<T>(
	promise: Promise<T>
): Promise<[T | null, any | null]> {
	try {
		const data = await promise;
		return [data, null];
	} catch (error) {
		console.error(error);
		return [null, error];
	}
}

export function getStripeContext() {
	return getContext<StripeContext>('stripe');
}

interface ModalContext {
	open: (product: Product) => void;
	close: () => void;
}

export function getModalContext() {
	return getContext<ModalContext>(MODAL);
}

export function getProductModalContext() {
	return getContext<ModalContext>(PRODUCT_MODAL);
}
