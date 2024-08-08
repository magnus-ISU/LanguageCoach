<script lang="ts">
	import OpenAI from "openai"
	import SvelteMarkdown from "svelte-markdown"

	type Message = OpenAI.Chat.ChatCompletionMessageParam

	let messages: Message[] = []
	let userInput = ""
	let isLoading = false
	let streamingMessage = ""

	const openai = new OpenAI({
		apiKey: "your-api-key", // Replace with your actual API key
		baseURL: "http://localhost:1234/v1", // Point to your local model
		dangerouslyAllowBrowser: true, // Allow usage in browser environment
	})

	async function sendMessage() {
		if (!userInput.trim()) return

		isLoading = true
		const userMessage: Message = { role: "user", content: userInput }
		messages = [...messages, userMessage]
		userInput = ""
		streamingMessage = ""

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
			isLoading = false
			messages = [...messages, { role: "assistant", content: streamingMessage }]
			streamingMessage = ""
		} catch (error) {
			console.error("Error:", error)
			isLoading = false
			messages = [...messages, { role: "assistant", content: "Sorry, an error occurred." }]
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

	<form on:submit|preventDefault={sendMessage}>
		<textarea bind:value={userInput} placeholder="Type your message..." disabled={isLoading}></textarea>
		<button type="submit" disabled={isLoading}>Send</button>
	</form>
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

	form {
		display: flex;
		flex-direction: column;
	}

	textarea {
		flex-grow: 1;
		padding: 5px;
		margin-bottom: 10px;
	}

	button {
		padding: 5px 10px;
	}
</style>
