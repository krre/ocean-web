<script lang="ts">
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import * as types from "$lib/types";
    import * as topic from "$lib/api/remote/forum/topic.remote";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { userSession } from "$lib/stores";
    import Frame from "$lib/components/Frame.svelte";
    import MessageEditor from "$lib/components/post/MessageEditor.svelte";

    const sectionId = +(page.params.id ?? 0);
    const title = "Создать тему";

    let name = $state("");

    let type = $state(types.ForumTopicType.Common);
    let answerSelection = $state(types.ForumPollAnswerSelection.One);
    let answers: string[] = $state([]);
    let post = $state("");

    const action = async () => {
        if (type == types.ForumTopicType.Poll) {
            if (answers.length < 2) {
                alert("Количество ответов в опросе должно быть не менее двух!");
                return;
            }

            for (let answer of answers) {
                if (!answer) {
                    alert("В опросе есть незаполненные ответы!");
                    return;
                }
            }
        }

        let poll_answers: string[] | undefined;
        let poll_answer_selection: types.ForumPollAnswerSelection | undefined;

        if (type === types.ForumTopicType.Poll) {
            poll_answers = answers;
            poll_answer_selection = answerSelection;
        }

        const result = await topic.create({
            section_id: sectionId,
            name: name,
            type: type,
            poll_answers,
            poll_answer_selection,
            token: $userSession.token,
        });

        const postParams: api.Forum.Post.Create.Request = {
            topic_id: result.id,
            post: post,
        };

        await api.Forum.Post.Create.exec(postParams, $userSession.token);

        goto(route.Forum.Topic.Id(result.id));
    };
</script>

<style>
    .form {
        display: grid;
        gap: 0.8em;
    }

    .answer {
        width: min(50em, 100%);
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.6em;
    }
</style>

<Frame {title}>
    <div class="form">
        Название: <input type="text" bind:value={name} />

        <div>
            <label>
                <input
                    type="radio"
                    bind:group={type}
                    value={types.ForumTopicType.Common}
                />
                Обычная тема
            </label>

            <label>
                <input
                    type="radio"
                    bind:group={type}
                    value={types.ForumTopicType.Poll}
                />
                Опрос
            </label>
        </div>

        {#if type == types.ForumTopicType.Poll}
            <div>
                Укажите вопрос в названии темы и добавьте варианты ответа.
            </div>

            {#each answers as answer, i}
                <div class="answer">
                    <input bind:value={answers[i]} />
                    <button
                        onclick={() => {
                            answers.splice(i, 1);
                            answers = answers;
                        }}>Удалить</button
                    >
                </div>
            {/each}

            <div>
                <button
                    onclick={() => {
                        answers.push("");
                        answers = answers;
                    }}>Добавить</button
                >
            </div>

            Сколько вариантов можно выбрать?

            <div>
                <label>
                    <input
                        type="radio"
                        bind:group={answerSelection}
                        value={types.ForumPollAnswerSelection.One}
                    />
                    Один
                </label>

                <label>
                    <input
                        type="radio"
                        bind:group={answerSelection}
                        value={types.ForumPollAnswerSelection.Several}
                    />
                    Несколько
                </label>
            </div>
        {/if}
    </div>
</Frame>

<MessageEditor
    bind:message={post}
    sendAction={action}
    sendButtonEnabled={name.length > 0 &&
        (type === types.ForumTopicType.Poll ? answers.length > 0 : true)}
/>
