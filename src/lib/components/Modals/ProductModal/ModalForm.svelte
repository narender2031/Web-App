<svelte:options immutable />

<script context="module" lang="ts">
	import { mdiInformation } from '@mdi/js';

	import type { Product, Variations } from 'types/product';
	import type { AddToCart } from './ProductModal.svelte';

	const AmountLabel = 'Menge';
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	import RadioButton from '$lib/components/Forms/RadioButton.svelte';

	export let product: Product;
	export let valid: boolean;
	export let quantitiy: number;
	export let addToCart: AddToCart;

	const { variations } = product;

	const addToCartBtnText = 'Zum Warenkorb hinzufügen';
</script>

<form
	id="product-modal"
	action="/add-to-cart"
	on:change={e => console.log((valid = e.currentTarget.checkValidity()))}
	on:submit|preventDefault={e => addToCart(e, product.variations)}
>
	<h1 class="title">Customization</h1>

	<div class="toppings">
		{#each product.variations?.toppings || [] as topping}
			<fieldset class="topping">
				<legend>{topping}</legend>

				{#each ['Kraken', 'Sasquatch', 'Mothman'] as item}
					{@const id = `${topping}-${item}`.toLowerCase()}
					<div class="topping-item">
						<label for={id}>
							<RadioButton {id} name={topping} value={item} required />
							<img width="70" src="/burger.png" alt="" role="presentation" />
							<span class="input-label">
								{item}
							</span>
						</label>
						<!-- style="color: var(--accent-color, orange); background-color: white;" -->
						<Button icon type="button" on:click={() => console.log('Hi')}>
							<Icon path={mdiInformation} />
						</Button>
					</div>
				{/each}
			</fieldset>
		{/each}
		{#each ['mama', 'dsd'] || [] as topping}
			<fieldset class="topping">
				<legend>{topping}</legend>

				{#each ['Kraken', 'Sasquatch', 'Mothman'] as item}
					{@const id = `${topping}-${item}`.toLowerCase()}
					<div class="topping-item">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label>
							<RadioButton {id} name={topping} value={item} required />
							<img width="70" src="/burger.png" alt="" role="presentation" />
							<span class="input-label">
								{item}
							</span>
						</label>
						<!-- style="color: var(--accent-color, orange); background-color: white;" -->
						<Button icon type="button" on:click={() => console.log('Hi')}>
							<Icon path={mdiInformation} />
						</Button>
					</div>
				{/each}
			</fieldset>
		{/each}
	</div>

	<div class="actions">
		<div class="amount-container">
			<Button
				size="small"
				style="font-size: 1.5em"
				class="form-elements-color"
				disabled={quantitiy <= 1 || quantitiy == null}
				fab
				on:click={() => quantitiy--}
			>
				-
			</Button>
			<label for="amount" class="visually-hidden">{AmountLabel}</label>
			<input id="amount" type="number" inputmode="numeric" bind:value={quantitiy} min="1" />
			<Button
				size="small"
				class="form-elements-color"
				style="font-size: 1.5em"
				fab
				on:click={() => quantitiy++}
			>
				+
			</Button>
		</div>

		<Button type="submit" class="form-elements-color" disabled={!valid} rounded>
			<span class="add-to-cart-text">{addToCartBtnText}</span>
		</Button>
	</div>
</form>

<style lang="scss">
	.title {
		font-size: 2em;
		margin: 0.6em 0 0.4em;
	}

	.price {
		font-size: 1.5em;
		font-weight: 500;
		padding-inline-start: 0.2em;
	}

	.amount-container {
		font-weight: bold;
		color: #fff;
	}

	#product-modal {
		--actions-height: 62.5px;

		accent-color: var(--accent-color, orange);
		// max-width: 42em;
		padding: var(--container-padding);
		color: #fff;
		flex: 0 0 calc(100% - var(--aside-width));
		position: relative;

		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
		}

		.info {
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.toppings {
		}

		.topping {
			border: none;
			margin: 1em 0;
			padding: 0.4em 0;
			display: flex;
			flex-wrap: wrap;

			&:last-child {
				margin-bottom: 0;
			}

			legend {
				font-size: 1.5em;
				font-weight: 600;
				flex: 1 1 100%;
			}
		}

		.topping-item {
			display: flex;
			align-items: center;
			padding: 0 0.6em;
			flex: 0 1 50%;

			&:hover {
				background: rgb(99, 165, 209);
				border-radius: 0.5em;
			}

			.info-button {
				margin-left: auto;
			}

			img {
				margin: 0 1em;
			}

			label {
				font-size: 1.2em;
				padding: 0.6em 0;
				padding-left: 0.5em;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				cursor: pointer;
			}
		}

		.add-to-cart-text {
			color: inherit;
			font-size: 1.2em;
			font-weight: 600;
		}

		.actions {
			height: var(--actions-height);

			display: flex;
			align-items: center;
			justify-content: space-between;

			padding: 0.7em;
			border-radius: 2em;
			// background: #fff;
			box-shadow: 4px 7px 24px 0 rgb(0 0 0 / 31%);
			background: var(--top2);
			position: var(--actions-position, sticky);

			:global(.s-dialog) & {
				left: 10px;
				bottom: 20px;
				right: 10px;
			}

			input {
				width: 3em;
				text-align: center;
				appearance: textfield;
				color: inherit;
			}
		}

		// $modalBP: 765px;
		$modalBP: 850px;

		@media screen and (min-width: $modalBP) {
			padding-bottom: 0;

			.title {
				font-size: 2.5em;
				text-align: center;
			}

			.actions {
				left: 10px;
				bottom: 0;
				right: 10px;
			}

			// .actions {
			// 	--actions-position: sticky;
			// }
		}
	}
</style>
