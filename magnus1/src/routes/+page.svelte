<script lang="ts">
	import Chat from "$lib/Chat.svelte"
	import type { StoryEntry, SelectedSentence } from "$lib/const.svelte"
	import Stories from "$lib/Stories.svelte"
	import Story from "$lib/Story.svelte"

	let stories: StoryEntry[] = $state([])
	let selectedStoryIndex: number | undefined = $state(undefined)
	let selectedSentence: SelectedSentence | undefined = $state(undefined)
</script>

<h1>Language Coach</h1>

<Stories bind:stories bind:selectedStoryIndex bind:selectedSentence />

{#if selectedStoryIndex !== undefined}
	<Story bind:stories bind:selectedStoryIndex bind:selectedSentence />

	{#if selectedSentence !== undefined}
		<!-- {#key selectedSentence} -->
		<Chat bind:stories bind:selectedStoryIndex bind:selectedSentence></Chat>
		<!-- {/key} -->
	{/if}
{/if}

<style>
	:global(*) {
		color: #fff;
		background-color: #222;
	}
</style>
