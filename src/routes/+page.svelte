<script lang="ts">
	let stories: Story[] = $state([
		{
			name: 'The Boy Who Cried Wolf',
			paragraphs: [
				[
					'There was once a shepherd boy who lived in a small village.',
					'He was bored with his job and decided to have some fun.'
				],
				[
					'He cried out for help, claiming a wolf was attacking his flock.',
					'The villagers came running, but there was no wolf.'
				],
				[
					'The boy did this several times, and the villagers eventually stopped believing him.',
					"One day, a wolf really did appear, but the villagers didn't believe the boy's cries for help."
				],
				[
					'The wolf devoured the flock, and the boy learned a valuable lesson.',
					'He realized that lying and deceiving others can have serious consequences.'
				]
			]
		},
		{
			name: 'Uncle Ry and the Moon',
			paragraphs: [
				[
					'My Uncle Ry lived alone in a small house up in the hills.',
					'He didn’t own many things.',
					'He lived a simple life.'
				],
				[
					'One evening, he discovered he had a visitor.',
					'A robber had broken into the house and was rummaging through my uncle’s few belongings.'
				],
				[
					'The robber didn’t notice Uncle Ry, and when my uncle said, “Hello,” the robber was so startled he almost fell down.',
					'My uncle smiled at the robber and shook his hand.'
				],
				[
					'“Welcome! Welcome!',
					'How nice of you to visit!”',
					'The robber opened his mouth to speak, but he couldn’t think of anything to say.'
				],
				[
					'Because Ry never let anyone leave empty-handed, he looked around the tiny hug for a gift for the robber.',
					'But there was nothing to give.'
				],
				[
					'The robber began to back toward the door.',
					'He wanted to leave.',
					'At last, Uncle Ry knew what to do.',
					'He took off his only robe, which was old and tattered.',
					'“Here,” he said. “Please take this.”'
				],
				[
					'The robber thought my uncle was crazy.',
					'He took the robe, dashed out the door, and escaped into the night.',
					'My uncle sat and looked at the moon, its silvery light spilling over the mountains, making all things quietly beautiful.'
				],
				[
					'“Poor man,” lamented my uncle.',
					'“All I had to give him was my tattered robe.',
					'If only I could have given him this wonderful moon.”'
				]
			]
		}
	]);

	let selectedStoryIndex: number | undefined = $state(undefined);
	let selectedSentence: { paragraph: number; sentence: number } | undefined = $state(undefined);

	function selectStory(index: number) {
		selectedSentence = undefined;
		selectedStoryIndex = index;
	}

	function selectSentence(paragraph: number, sentence: number) {
		selectedSentence = {
			paragraph: paragraph,
			sentence: sentence
		};
	}

	function sentenceContext(story: Story, paragraph: number): string {
		return story.paragraphs
			.slice(Math.max(paragraph - 1, 0), paragraph + 2)
			.map((v) => v.join(' '))
			.join('\n');
	}
</script>

<h1>Language Coach</h1>
{#each stories as story, index (story.name)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="card" onclick={() => selectStory(index)}>
		<h2>{story.name}</h2>
	</div>
{/each}

{#if selectedStoryIndex !== undefined}
	<h2>{stories[selectedStoryIndex].name}</h2>
	{#each stories[selectedStoryIndex].paragraphs as paragraph, paragraphIndex}
		<div>
			{#each paragraph as sentence, sentenceIndex (sentence)}
				{#if sentenceIndex !== 0}&nbsp{/if}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="sentence" onclick={() => selectSentence(paragraphIndex, sentenceIndex)}>
					{sentence}
				</div>
			{/each}
		</div>
	{/each}

	{#if selectedSentence !== undefined}
		<h2>Chat</h2>
		<p>
			You are a language instruction program. The user is reading the following sentence in the
			story "{stories[selectedStoryIndex].name}":
		</p>
		<p>
			{stories[selectedStoryIndex].paragraphs[selectedSentence.paragraph][
				selectedSentence.sentence
			]}
		</p>
		<p>
			The context in the story is: ```
			{sentenceContext(stories[selectedStoryIndex], selectedSentence.paragraph)}
			```
		</p>
		<p>They need help understanding this sentence. Break it down for them.</p>
		<p>
			The user has provided the following information about their understanding of the language: I
			am a 1337 h4x0r
		</p>
	{/if}
{/if}

<style>
	.sentence {
		display: inline-block;
		transform: scale(1);
		transition: transform 0.2s;
	}
	.sentence:hover {
		transform: scale(1.01);
	}
	p {
		white-space: pre-line;
	}
</style>
