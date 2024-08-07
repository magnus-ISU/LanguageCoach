<script>
	import { onMount } from "svelte"
	import OpenAI from "openai"

	let messages = []
	let userInput = ""
	let isLoading = false

	const openai = new OpenAI({
		apiKey: "your-api-key", // Replace with your actual API key
		baseURL: "http://localhost:1234/v1", // Point to your local model
	})

	async function sendMessage() {
		if (!userInput.trim()) return

		isLoading = true
		messages = [...messages, { role: "user", content: userInput }]
		const userMessage = userInput
		userInput = ""

		try {
			const response = await openai.chat.completions.create({
				model: "your-local-model-name", // Replace with your actual model name
				messages: messages.map(({ role, content }) => ({ role, content })),
			})

			const assistantMessage = response.choices[0].message.content
			messages = [...messages, { role: "assistant", content: assistantMessage }]
		} catch (error) {
			console.error("Error:", error)
			messages = [...messages, { role: "assistant", content: "Sorry, an error occurred." }]
		}

		isLoading = false
	}

	onMount(() => {
		// You can add any initialization logic here
	})
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
		<input type="text" bind:value={userInput} placeholder="Type your message..." disabled={isLoading} />
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

	input {
		flex-grow: 1;
		padding: 5px;
	}

	button {
		padding: 5px 10px;
	}
</style>
