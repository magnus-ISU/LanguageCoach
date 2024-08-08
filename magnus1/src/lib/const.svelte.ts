import OpenAI from "openai"
export type Message = OpenAI.Chat.ChatCompletionMessageParam

export type Sentence = {
	sentence: string
	chat: Message[]
}
export type Sentences = Sentence[]
export type StoryEntry = {
	name: string
	paragraphs: Sentences[]
}
export type SelectedSentence = {
	paragraph: number
	sentence: number
}
