<script lang="ts">
	import type { StoryEntry, SelectedSentence } from "./const.svelte"

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

	function sentenceContext(story: StoryEntry, paragraph: number): string {
		return story.paragraphs
			.slice(Math.max(paragraph - 1, 0), paragraph + 2)
			.map((v) => v.map((v) => v.sentence).join(" "))
			.join("\n")
	}

	function initialMessageText(): string {
		return `You are a language instruction program that outputs markdown. Do not apologize, simply omit anything you cannot do. The user is reading the story "${story.name}". The context in the story is:

\`\`\`
${sentenceContext(story, selectedSentence.paragraph)}
\`\`\`

They need help understanding this sentence: "${sentence.sentence.trim()}". Break it down for them.

The user says: "${userLevel}"`
	}

	import OpenAI from "openai"
	import SvelteMarkdown from "svelte-markdown"
	import Textarea from "./Textarea.svelte"

	let userInput = $state("")
	let isLoading = $derived(sentence.stream !== "")

	const openai = new OpenAI({
		apiKey: "",
		baseURL: "http://localhost:1234/v1",
		dangerouslyAllowBrowser: true,
	})

	function sendMessage() {
		if (!userInput.trim()) return

		sentence.chat.push({ role: "user", content: userInput })
		userInput = ""
	}

	async function receiveMessage() {
		const ref = sentence
		ref.stream = "..."
		let dummyMessage = true
		try {
			const stream = await openai.chat.completions.create({
				model: "local",
				messages: sentence.chat,
				stream: true,
			})

			for await (const chunk of stream) {
				if (dummyMessage) {
					ref.stream = chunk.choices[0]?.delta?.content || ""
					dummyMessage = false
				} else {
					ref.stream += chunk.choices[0]?.delta?.content || ""
				}
			}

			// Only update the messages array when the loading state is finished
			ref.chat.push({ role: "assistant", content: ref.stream })
		} catch (error) {
			console.error("Error:", error)
			ref.chat.push({ role: "assistant", content: "Sorry, an error occurred." })
		}
		ref.stream = ""
	}

	function addChat(event: KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) {
		if (event.shiftKey && event.key === "Enter") {
			sendMessage()
			receiveMessage()
		}
	}

	$effect(function () {
		if (sentence.chat.length === 0) {
			userInput = initialMessageText()
			sendMessage()
			receiveMessage()
		}
	})
</script>

<h2>Chat</h2>

<div class="chat-container">
	{#each sentence.chat as message}
		<div class="message {message.role}">
			<SvelteMarkdown source={`**${message.role}:** ${message.content}`} />
		</div>
	{/each}
	{#if isLoading}
		<div class="message assistant">
			<SvelteMarkdown source={`**Assistant:** ${sentence.stream}`} />
		</div>
	{/if}
</div>

<Textarea bind:value={userInput} keypress={addChat}>
	{#snippet placeholder()}
		{#if userInput === ""}
			Shift+Enter to chat further...
		{/if}
	{/snippet}
</Textarea>

<style>
	.chat-container {
		height: 400px;
		overflow-y: auto;
		border: 1px solid #ccc;
		padding: 10px;
		margin-bottom: 10px;
	}

	.user {
		text-align: right;
	}

	.assistant {
		text-align: left;
	}
</style>
