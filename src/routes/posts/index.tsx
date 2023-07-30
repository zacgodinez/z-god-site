import {
	Resource,
	component$,
	useResource$,
	useSignal,
} from "@builder.io/qwik";
import {
	Link,
	type DocumentHeadProps,
	type DocumentHead,
} from "@builder.io/qwik-city";
import { twMerge } from "tailwind-merge";
import { asyncMap } from "~/lib/asyncmap";
import type { Post } from "~/types/definitions";
import { searchPost } from "~/lib/fuzzy";

export default component$(() => {
	const searchingValue = useSignal<string>("");

	const postRes = useResource$(async ({ track }): Promise<Post[]> => {
		const searchValue = track(() => searchingValue.value);
		const modules = import.meta.glob("/src/routes/**/**/index.mdx");
		const posts = await asyncMap(Object.keys(modules), async (path) => {
			const data = (await modules[path]()) as DocumentHeadProps;

			return {
				title: data.head.title,
				desc: data.head.frontmatter.desc,
				date: data.head.frontmatter.date,
				permalink: data.head.frontmatter.permalink,
				tags: data.head.frontmatter.tags,
				draft: data.head.frontmatter.draft,
			};
		});

		if (searchValue !== "") {
			return searchPost(searchValue.toLowerCase(), posts);
		}

		return posts.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});
	});

	return (
		<>
			<section class="w-full ">
				<h1 class="text-3xl ">posts</h1>
				<Resource
					value={postRes}
					onResolved={(posts) => (
						<div class="flex flex-col gap-5 p-10">
							{import.meta.env.PUBLIC_ENV === "development" &&
								posts
									.filter((post) => post.draft)
									.map((post) => <PostCard key={post.permalink} {...post} />)}
							{posts
								.filter((post) => !post.draft)
								.map((post) => (
									<PostCard key={post.permalink} {...post} />
								))}
						</div>
					)}
				/>
			</section>
		</>
	);
});

const PostCard = component$((props: Post) => {
	return (
		<Link
			key={props.permalink}
			href={props.permalink}
			class={twMerge("border border-red-50", "group ")}
		>
			<h2 class="text-xl font-medium font-heading truncate">{props.title}</h2>
			<p class="mt-2 text-neutral-300 truncate">{props.desc}</p>
			<p class="mt-2 text-neutral-300 text-sm">{props.date}</p>
			{props.tags.length > 0 && (
				<div class="flex flex-row flex-wrap mt-2">
					{props.tags.map((tag) => (
						<span key={tag} class={twMerge("px-3", "rounded-full transition")}>
							{tag}
						</span>
					))}
					{props.draft && (
						<span
							class={twMerge(
								"px-3 py-1 mr-2 bg-yellow-400 group-hover:bg-yellow-300",
								"rounded-full text-neutral-900 text-xs transition"
							)}
							title="draft"
						>
							draft
						</span>
					)}
				</div>
			)}
		</Link>
	);
});

export const head: DocumentHead = {
	title: "Posts",
	meta: [
		{
			name: "description",
			content: "Posts I've made",
		},
		{
			name: "og:title",
			content: "Posts",
		},
		{
			name: "og:description",
			content: "Posts I've made",
		},
	],
};
