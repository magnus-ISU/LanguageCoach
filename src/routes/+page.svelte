<script lang="ts">
	import Chat from "$lib/Chat.svelte"
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
		<Chat bind:stories bind:selectedStoryIndex bind:selectedSentence></Chat>
	{/if}
{/if}
