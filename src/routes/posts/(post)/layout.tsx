import { Slot, component$ } from "@builder.io/qwik";
import { type DocumentHead, useDocumentHead } from "@builder.io/qwik-city";
import { twMerge } from "tailwind-merge";
// import { LuMessageSquare } from "@qwikest/icons/lucide";

export default component$(() => {
	const { frontmatter, title } = useDocumentHead();

	return (
		<>
			<section class="w-full max-w-4xl ">
				<h1 class="text-3xl ">{title}</h1>
				<div class={twMerge("flex flex-col lg:flex-row-reverse gap-2 w-full")}>
					<date class="text-neutral-500 px-3 py-1 rounded-full block w-fit">
						{frontmatter.date}
					</date>
					<p class="text-neutral-300 line-clamp-2 lg:line-clamp-1">
						{frontmatter.desc}
					</p>
				</div>
				<div>
					<Slot />
				</div>
			</section>
		</>
	);
});

export const head: DocumentHead = ({ head }) => {
	return {
		title: head.title,
		meta: [
			{
				name: "description",
				content: head.frontmatter.desc ?? "No description",
			},
			{
				name: "og:title",
				content: head.title,
			},
			{
				name: "og:description",
				content: head.frontmatter.desc ?? "No description",
			},
		],
	};
};
