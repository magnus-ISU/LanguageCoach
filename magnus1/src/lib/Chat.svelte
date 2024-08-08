<script lang="ts">
	import type { Message } from "$lib/const.svelte"
	import type { StoryEntry, SelectedSentence } from "./const.svelte"
	import Llm from "./LLM.svelte"

	type Props = {
		stories: StoryEntry[]
		selectedStoryIndex: number
		selectedSentence: SelectedSentence
	}
	let { stories = $bindable(), selectedStoryIndex = $bindable(), selectedSentence = $bindable() }: Props = $props()

	let userLevel =
		"I am a competent Portugues speaker but don't know the differences between spanish and portugues. I know hiragana and katakana, but not any japanese kanji. Please provide pronunciation support for kanji."

	let story = $derived(stories[selectedStoryIndex])
	let paragraph = $derived(story.paragraphs[selectedSentence.paragraph])
	let sentence = $derived(paragraph[selectedSentence.sentence])
	let initialMessage: Message[] = $state([{ role: "user", content: initialMessageText() }])

	function sentenceContext(story: StoryEntry, paragraph: number): string {
		return story.paragraphs
			.slice(Math.max(paragraph - 1, 0), paragraph + 2)
			.map((v) => v.map((v) => v.sentence).join(" "))
			.join("\n")
	}

	function initialMessageText(): string {
		return `
		You are a language instruction program that outputs markdown. The user is reading the story "${story.name}"

		The context in the story is:

		\`\`\`
		${sentenceContext(story, selectedSentence.paragraph)}

		\`\`\`

		They need help understanding this sentence: "${sentence.sentence.trim()}". Break it down for them.

		The user says: "${userLevel}"
		`
	}
</script>

<h2>Chat</h2>

<Llm bind:messages={initialMessage} />
