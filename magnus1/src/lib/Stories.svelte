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
				["There was once a shepherd boy who lived in a small village.", " He was bored with his job and decided to have some fun."],
				["He cried out for help, claiming a wolf was attacking his flock.", " The villagers came running, but there was no wolf."],
				[
					"The boy did this several times, and the villagers eventually stopped believing him.",
					" One day, a wolf really did appear, but the villagers didn't believe the boy's cries for help.",
				],
				[
					" The wolf devoured the flock, and the boy learned a valuable lesson.",
					" He realized that lying and deceiving others can have serious consequences.",
				],
			],
		},
		{
			name: "Uncle Ry and the Moon",
			paragraphs: [
				["My Uncle Ry lived alone in a small house up in the hills.", " He didn’t own many things.", " He lived a simple life."],
				["One evening, he discovered he had a visitor.", " A robber had broken into the house and was rummaging through my uncle’s few belongings."],
				[
					"The robber didn’t notice Uncle Ry, and when my uncle said, “Hello,” the robber was so startled he almost fell down.",
					" My uncle smiled at the robber and shook his hand.",
				],
				["“Welcome! Welcome!", " How nice of you to visit!”", " The robber opened his mouth to speak, but he couldn’t think of anything to say."],
				["Because Ry never let anyone leave empty-handed, he looked around the tiny hug for a gift for the robber.", " But there was nothing to give."],
				[
					"The robber began to back toward the door.",
					" He wanted to leave.",
					" At last, Uncle Ry knew what to do.",
					" He took off his only robe, which was old and tattered.",
					" “Here,” he said. “Please take this.”",
				],
				[
					"The robber thought my uncle was crazy.",
					" He took the robe, dashed out the door, and escaped into the night.",
					" My uncle sat and looked at the moon, its silvery light spilling over the mountains, making all things quietly beautiful.",
				],
				["“Poor man,” lamented my uncle.", " “All I had to give him was my tattered robe.", " If only I could have given him this wonderful moon.”"],
			],
		},
	]
	stories.push({
		name: "Uncle Ry and the Moon, Japanese",
		paragraphs:
			rawStringToParagraphArray(`私のおじさんリーは、山の上に小さな家で一人暮らしていました。彼は多くの物を所有していませんでした。シンプルな生活を送っていました。
ある夜、彼は訪問者が来ていることに気付きました。泥棒が家に乗り込んでおじさんリーの少数の所有物を探りまわっていました。
泥棒はおじさんリーに気づきませんでした。そこでおじさんが「こんにちは」と言うと、泥棒は驚いてからすっかり倒れるところでした。おじさんリーは泥棒に微笑み、手を握りました。
「ようこそ！ようこそ！どうもご訪問いただきありがとう！」おじさんリーは言います。泥棒は口を開けますが、何も言えることがありませんでした。
リーさんは誰にも空っぽの手では帰らせないから、泥棒への贈り物を小さな部屋から探しました。しかし何もありませんでした。
泥棒はドアの方に後退し始めました。彼女は去りたいと思っています。やがて、おじさんリーはどうするかわかりました。彼は唯一持っていたローブを脱ぎました。それは古くてズタズタでした。「これ、もらってください」と言って差し出します。
泥棒はおじさんが狂っていると思いました。彼女はローブを取り、ドアから逃げ出し夜に消えました。おじさんリーは座って月を見ます。その銀色の光は山々を浴びて、すべてのものを静かに美しくしていました。
「貧しい人ですね」とおじさんリーは嘆きます。「私が彼にあげられたのはただのズタズタのローブだけだったわ。もしこんな美しい月を貰えたらよかったのに」。`),
	})

	function selectStory(index: number) {
		selectedSentence = undefined
		selectedStoryIndex = index
	}

	function rawStringToSentences(text: string): Sentences {
		let sentences: Sentences = []
		let match: RegExpExecArray | null
		while ((match = /[\.?!。]/.exec(text)) != null) {
			let str = text.slice(0, match.index + 1)
			sentences.push(str)
			text = text.slice(match.index + 1)
		}
		if (text.trim() !== "") {
			sentences.push(text)
		}
		return sentences
	}
	function rawStringToParagraphArray(text: string): Sentences[] {
		return text.split("\n").map((p) => rawStringToSentences(p))
	}

	function addStory(event: KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) {
		if (event.shiftKey && event.key === "Enter") {
			let text = textarea_value.trim()
			let newlineIndex = text.indexOf("\n")
			if (newlineIndex !== text.length && newlineIndex !== -1) {
				let title = text.slice(0, newlineIndex)
				let content = text.slice(newlineIndex + "\n".length)
				let paragraphs = rawStringToParagraphArray(content)
				stories.push({
					name: title,
					paragraphs: paragraphs,
				})
				selectStory(stories.length - 1)
				textarea_value = ""
				event.preventDefault()
			}
		}
	}

	let textarea_value = $state("")
</script>

{#each stories as story, index}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onclick={() => selectStory(index)}>
		<h3>{story.name}</h3>
	</div>
{/each}

<div class="textarea-container">
	<div class="textarea-placeholder">
		{#if textarea_value === ""}Put the title of the story on the first line{/if}
		{#if [-1, textarea_value.length - 1].includes(textarea_value.indexOf("\n"))}
			<br />Enter your story afterwards
			<br />Shift+Enter to add the story
		{/if}
	</div>
	<textarea onkeypress={addStory} bind:value={textarea_value}></textarea>
</div>

<style>
	.textarea-container {
		position: relative;
		width: 100%;
		height: 10rem;
	}

	textarea {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: transparent;
		resize: none;
		border: 1px solid #ccc;
		border-radius: 10px;
		border-color: #808;
	}
	textarea:focus {
		outline: none !important;
		border-color: #b0b;
		box-shadow: 0 0 10px #719ece;
	}

	.textarea-placeholder {
		position: absolute;
		top: 1px;
		left: 1px;
		color: #666;
		pointer-events: none;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	textarea,
	.textarea-placeholder {
		font:
			14px Arial,
			sans-serif;
		padding: 0.5rem;
		box-sizing: border-box;
	}
</style>
