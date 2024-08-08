<script lang="ts">
	import OpenAI from "openai"
	import SvelteMarkdown from "svelte-markdown"
	import type { EventHandler } from "svelte/elements"

	type Message = OpenAI.Chat.ChatCompletionMessageParam

	let messages: Message[] = $state([])
	let userInput = $state("")
	let streamingMessage = $state("")
	let isLoading = $derived(streamingMessage === "")

	const openai = new OpenAI({
		apiKey: "",
		baseURL: "http://localhost:1234/v1",
		dangerouslyAllowBrowser: true,
	})

	async function sendMessage() {
		if (!userInput.trim()) return

		messages.push({ role: "user", content: userInput })
		userInput = ""
		streamingMessage = "..."

		try {
			const stream = await openai.chat.completions.create({
				model: "your-local-model-name", // Replace with your actual model name
				messages: messages,
				stream: true,
			})

			for await (const chunk of stream) {
				streamingMessage += chunk.choices[0]?.delta?.content || ""
			}

			// Only update the messages array when the loading state is finished
			messages.push({ role: "assistant", content: streamingMessage })
			streamingMessage = ""
		} catch (error) {
			console.error("Error:", error)
			messages.push({ role: "assistant", content: "Sorry, an error occurred." })
			streamingMessage = ""
		}
	}

	function addChat(event: KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) {
		if (event.shiftKey && event.key === "Enter") {
			sendMessage()
		}
	}
</script>

<main>
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

	<textarea bind:value={userInput} placeholder="Chat with an llm..." disabled={isLoading} onkeypress={addChat}></textarea>
</main>

<style>
	.chat-container {
		height: 400px;
		overflow-y: auto;
		border: 1px solid #ccc;
		padding: 10px;
		margin-bottom: 10px;
	}

	.message {
		margin-bottom: 10px;
	}

	.user {
		text-align: right;
	}

	.assistant {
		text-align: left;
	}

	textarea {
		width: 100%;
		height: 10rem;
		border: 1px solid #ccc;
		border-radius: 10px;
		border-color: #808;
		font:
			14px Arial,
			sans-serif;
		padding: 0.5rem;
		box-sizing: border-box;
	}
	textarea:focus {
		outline: none !important;
		border-color: #b0b;
		box-shadow: 0 0 10px #719ece;
	}
</style>
