import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import ToggleTheme from "~/components/toggle-theme";
import * as styles from "./index.css";

export default component$(() => {
	const count = useSignal(0);

	return (
		<>
			<h1 class={styles.blueClass}>
				Welcome to Qwik <span class="lightning">⚡️</span>
			</h1>
			<h1 class="font-sans text-4xl font-bold">testing Inter font</h1>

			<div class="w-full ">
				<button
					onClick$={() => {
						console.log("hello");
						count.value++;
					}}
				>
					Increment {count.value}
				</button>
				<ToggleTheme />
			</div>
		</>
	);
});

export const head: DocumentHead = {
	title: "Welcome to Qwik",
	meta: [
		{
			name: "description",
			content: "Qwik site description",
		},
	],
};
