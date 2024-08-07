<script lang="ts">
	type Props = {
		stories: StoryEntry[]
		selectedStoryIndex: number
		selectedSentence: SelectedSentence
	}
	let { stories = $bindable(), selectedStoryIndex = $bindable(), selectedSentence = $bindable() }: Props = $props()

	function sentenceContext(story: StoryEntry, paragraph: number): string {
		return story.paragraphs
			.slice(Math.max(paragraph - 1, 0), paragraph + 2)
			.map((v) => v.join(" "))
			.join("\n")
	}
</script>

<h2>Chat</h2>
<p>
	You are a language instruction program. The user is reading the following sentence in the story "{stories[selectedStoryIndex].name}":
</p>
<p>
	{stories[selectedStoryIndex].paragraphs[selectedSentence.paragraph][selectedSentence.sentence]}
</p>
<p>
	The context in the story is: ```
	{sentenceContext(stories[selectedStoryIndex], selectedSentence.paragraph)}
	```
</p>
<p>They need help understanding this sentence. Break it down for them.</p>
<p>
	The user has provided the following information about their understanding of the language: I am a competent Portugues speaker but don't know the
	differences between spanish and Portugues.
</p>
