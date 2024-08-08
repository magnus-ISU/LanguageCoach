<script lang="ts">
	import OpenAI from "openai"

	type Message = OpenAI.Chat.ChatCompletionMessageParam

	let messages: Message[] = []
	let userInput = ""
	let isLoading = false

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

		try {
			const response = await openai.chat.completions.create({
				model: "your-local-model-name", // Replace with your actual model name
				messages: messages,
			})

			const assistantMessage = response.choices[0].message
			messages = [...messages, assistantMessage]
		} catch (error) {
			console.error("Error:", error)
			messages = [...messages, { role: "assistant", content: "Sorry, an error occurred." }]
		}

		isLoading = false
	}
</script>

<main>
	<div class="chat-container">
		{#each messages as message}
			<div class="message {message.role}">
				<strong>{message.role}:</strong>
				{message.content}
			</div>
		{/each}
		{#if isLoading}
			<div class="message assistant">
				<strong>Assistant:</strong> Thinking...
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
	}

	textarea {
		flex-grow: 1;
		padding: 5px;
	}

	button {
		padding: 5px 10px;
	}
</style>
