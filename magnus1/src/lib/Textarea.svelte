<script lang="ts">
	import type { Snippet } from "svelte"

	type Props = {
		value: string
		keypress: (event: KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) => void
		placeholder: Snippet
	}
	let { value = $bindable(), keypress = $bindable(), placeholder }: Props = $props()
</script>

<div class="textarea-container">
	<div class="textarea-placeholder">
		{@render placeholder()}
	</div>
	<textarea onkeypress={keypress} bind:value></textarea>
</div>

<style>
	.textarea-container {
		position: relative;
		width: 100%;
		height: 10rem;
	}

	textarea {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: transparent;
		resize: none;
		border: 1px solid #ccc;
		border-radius: 10px;
		border-color: #808;
	}
	textarea:focus {
		outline: none !important;
		border-color: #b0b;
		box-shadow: 0 0 10px #719ece;
	}

	.textarea-placeholder {
		position: absolute;
		top: 1px;
		left: 1px;
		color: #666;
		pointer-events: none;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	textarea,
	.textarea-placeholder {
		font:
			14px Arial,
			sans-serif;
		padding: 0.5rem;
		box-sizing: border-box;
	}
</style>
