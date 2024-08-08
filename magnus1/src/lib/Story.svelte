<script lang="ts">
	type Props = {
		stories: StoryEntry[]
		selectedStoryIndex: number
		selectedSentence: SelectedSentence | undefined
	}
	let { stories = $bindable(), selectedStoryIndex = $bindable(), selectedSentence = $bindable() }: Props = $props()

	function selectSentence(paragraph: number, sentence: number) {
		selectedSentence = {
			paragraph: paragraph,
			sentence: sentence,
		}
	}
</script>

{#if selectedStoryIndex !== undefined}
	<h2>{stories[selectedStoryIndex].name}</h2>
	{#each stories[selectedStoryIndex].paragraphs as paragraph, paragraphIndex}
		<div>
			{#each paragraph as sentence, sentenceIndex (sentence)}
				<!-- {#if sentenceIndex !== 0}&nbsp{/if} -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="sentence" onclick={() => selectSentence(paragraphIndex, sentenceIndex)}>
					{sentence}
				</div>
			{/each}
		</div>
	{/each}
{/if}

<style>
	.sentence {
		display: inline-block;
		white-space: pre;
		transform: scale(1);
		transition: transform 0.2s;
	}
	.sentence:hover {
		transform: scale(1.01);
	}
</style>
