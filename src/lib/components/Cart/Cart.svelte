<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';

	import CartItemComponent from './CartItem.svelte';

	import { enhance } from './action';

	import type { Cart } from '$lib/stores/cart';

	export let cart: Cart;

	const tableHeaders = ['Produkt', 'Anzahl', 'Preis', '']; //'Teilsumme',
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<h1>Warenkorb</h1>

<div id="cart">
	{#if cart.size === 0}
		<p>No items in cart yet.</p>
	{:else}
		<form
			action="/api/checkout"
			use:enhance={{
				result: () => {
					//
				},
			}}
		>
			<table>
				<!-- <caption id="table-title" colspan={tableHeaders.length}>Produkte</caption> -->
				<thead>
					<tr>
						{#each tableHeaders as header}
							<th scope="col">{header}</th>
						{/each}
					</tr>
				</thead>
				<tbody aria-live="polite">
					{#each [...cart] as [SKU, item] (SKU)}
						<CartItemComponent {item} />
					{/each}

					<!-- {#each [...$cart] as [SKU, item] (SKU)}
						<CartItemComponent {item} />
					{/each} -->

					<!-- {#each $cart as item (item.name)}
					<CartItemComponent {item} quantity={item.quantity} />
					{/each} -->
				</tbody>
				<tfoot>
					<tr>
						<td colspan={tableHeaders.length}>
							<div>
								<label for="notes">Anmerkungen: </label>
								<textarea name="notes" id="notes" placeholder="Anmerkungen: " />
							</div>
						</td>
					</tr>
					<tr>
						<td colspan={tableHeaders.length - 2}>
							Summe ({cart.size} Produkte): {cart.size}
						</td>
						<td colspan="2">
							<Button type="submit" class="form-elements-color" rounded
								>Zur Kasse</Button
							>
						</td>
					</tr>
				</tfoot>
			</table>
		</form>
	{/if}
</div>

<style lang="scss">
	#cart {
		display: block;
	}

	h1 {
		text-align: center;
		margin: 0.2em 1.3em;
	}

	form {
		display: flex;
		justify-content: center;
	}

	table {
		max-width: 93%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-collapse: separate;
		border-radius: 1rem;
		border-spacing: 0 1em;
		text-align: center;
	}

	thead {
		background-color: var(--theme-primary-color);
		position: absolute;
		top: -9999px;
		left: -9999px;

		th {
			&:first-child {
				border-start-start-radius: 1em;
				border-end-start-radius: 1em;

				// border-top-left-radius: 1em;
				// border-bottom-left-radius: 1em;
			}

			&:last-child {
				border-start-end-radius: 1em;
				border-end-end-radius: 1em;
				// border-top-right-radius: 1em;
				// border-bottom-right-radius: 1em;
			}
		}
	}

	textarea {
		display: block;
		resize: none;
		border: 2px solid var(--tint-color);
		width: 100%;
		min-height: 6em;
		border-radius: 0.9em;
		padding: 0.8em;
		margin-top: 0.75em;
	}

	tfoot {
		text-align: center;
		border-radius: 1em;
		background-color: var(--theme-secondary-color);
		width: 100%;

		tr {
			color: var(--cart-table-color);
			text-align: center;
			width: 100%;

			div {
				text-align: left;
			}

			td {
				width: 100%;
				padding: 1em;
				text-align: right;

				&:first-child {
					border-start-start-radius: 1em;
					border-end-start-radius: 1em;
					// border-top-left-radius: 1em;
					// border-bottom-left-radius: 1em;
				}

				&:last-child {
					border-start-end-radius: 1em;
					border-end-end-radius: 1em;
					// border-top-right-radius: 1em;
					// border-bottom-right-radius: 1em;
				}
			}
		}
	}

	th {
		padding: 8px;
		padding-top: 12px;
		padding-bottom: 12px;
		text-align: center;
		color: var(--cart-table-color);
	}

	@media screen and (min-width: 460px) {
		table {
			display: table;
		}

		thead {
			position: relative;
			top: unset;
			left: unset;
		}

		tbody {
			display: table-row-group;
		}
	}
</style>
