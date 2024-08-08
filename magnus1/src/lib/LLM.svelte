<script lang="ts">
	import OpenAI from "openai"
	import SvelteMarkdown from "svelte-markdown"
	import type { Message } from "./const.svelte"
	import Textarea from "./Textarea.svelte"

	type Props = {
		messages: Message[]
	}
	let { messages = $bindable() }: Props = $props()

	let userInput = $state("")
	let streamingMessage = $state("")
	let isLoading = $derived(streamingMessage !== "")

	const openai = new OpenAI({
		apiKey: "",
		baseURL: "http://localhost:1234/v1",
		dangerouslyAllowBrowser: true,
	})

	if (messages.length !== 0) {
		receiveMessage()
	}

	function sendMessage() {
		if (!userInput.trim()) return

		messages.push({ role: "user", content: userInput })
		userInput = ""
	}

	async function receiveMessage() {
		streamingMessage = "..."
		let dummyMessage = true
		try {
			const stream = await openai.chat.completions.create({
				model: "local",
				messages: messages,
				stream: true,
			})

			for await (const chunk of stream) {
				if (dummyMessage) {
					streamingMessage = chunk.choices[0]?.delta?.content || ""
					dummyMessage = false
				} else {
					streamingMessage += chunk.choices[0]?.delta?.content || ""
				}
			}

			// Only update the messages array when the loading state is finished
			messages.push({ role: "assistant", content: streamingMessage })
		} catch (error) {
			console.error("Error:", error)
			messages.push({ role: "assistant", content: "Sorry, an error occurred." })
		}
		streamingMessage = ""
	}

	function addChat(event: KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) {
		if (event.shiftKey && event.key === "Enter") {
			sendMessage()
			receiveMessage()
		}
	}
</script>

<div class="chat-container">
	{#each messages as message}
		<div class="message {message.role}">
			<SvelteMarkdown source={`**${message.role}:** ${message.content}`} />
		</div>
	{/each}
	{#if isLoading}
		<div class="message assistant">
			<SvelteMarkdown source={`**Assistant:** ${streamingMessage}`} />
		</div>
	{/if}
</div>

<Textarea bind:value={userInput} keypress={addChat}>
	{#snippet placeholder()}
		Shift+Enter to chat with an LLM...
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
