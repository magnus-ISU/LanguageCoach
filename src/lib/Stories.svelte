<script lang="ts">
	type Props = {
		stories: StoryEntry[]
		selectedStoryIndex: number | undefined
		selectedSentence: SelectedSentence | undefined
	}
	let { stories = $bindable(), selectedStoryIndex = $bindable(), selectedSentence = $bindable() }: Props = $props()

	stories = [
		{
			name: "The Boy Who Cried Wolf",
			paragraphs: [
				["There was once a shepherd boy who lived in a small village.", "He was bored with his job and decided to have some fun."],
				["He cried out for help, claiming a wolf was attacking his flock.", "The villagers came running, but there was no wolf."],
				[
					"The boy did this several times, and the villagers eventually stopped believing him.",
					"One day, a wolf really did appear, but the villagers didn't believe the boy's cries for help.",
				],
				[
					"The wolf devoured the flock, and the boy learned a valuable lesson.",
					"He realized that lying and deceiving others can have serious consequences.",
				],
			],
		},
		{
			name: "Uncle Ry and the Moon",
			paragraphs: [
				["My Uncle Ry lived alone in a small house up in the hills.", "He didn’t own many things.", "He lived a simple life."],
				["One evening, he discovered he had a visitor.", "A robber had broken into the house and was rummaging through my uncle’s few belongings."],
				[
					"The robber didn’t notice Uncle Ry, and when my uncle said, “Hello,” the robber was so startled he almost fell down.",
					"My uncle smiled at the robber and shook his hand.",
				],
				["“Welcome! Welcome!", "How nice of you to visit!”", "The robber opened his mouth to speak, but he couldn’t think of anything to say."],
				["Because Ry never let anyone leave empty-handed, he looked around the tiny hug for a gift for the robber.", "But there was nothing to give."],
				[
					"The robber began to back toward the door.",
					"He wanted to leave.",
					"At last, Uncle Ry knew what to do.",
					"He took off his only robe, which was old and tattered.",
					"“Here,” he said. “Please take this.”",
				],
				[
					"The robber thought my uncle was crazy.",
					"He took the robe, dashed out the door, and escaped into the night.",
					"My uncle sat and looked at the moon, its silvery light spilling over the mountains, making all things quietly beautiful.",
				],
				["“Poor man,” lamented my uncle.", "“All I had to give him was my tattered robe.", "If only I could have given him this wonderful moon.”"],
			],
		},
	]

	function selectStory(index: number) {
		selectedSentence = undefined
		selectedStoryIndex = index
	}

	function addStory(event: KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) {
		if (event.shiftKey && event.key === "Enter") {
			let text = event.currentTarget.value.trim()
			let newlineIndex = text.indexOf("\n")
			if (newlineIndex !== text.length && newlineIndex !== -1) {
				let title = text.slice(0, newlineIndex)
				let content = text.slice(newlineIndex + "\n".length)
				stories.push({
					name: title,
					paragraphs: [[content]],
				})
				selectStory(stories.length - 1)
				event.currentTarget.value = ""
				event.preventDefault()
			}
		}
	}
</script>

{#each stories as story, index}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onclick={() => selectStory(index)}>
		<h3>{story.name}</h3>
	</div>
{/each}

<textarea style="width: 100%; height: 10rem;" onkeypress={addStory} placeholder="Shift+Enter to add a new story..."></textarea>
