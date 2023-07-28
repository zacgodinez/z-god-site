import { component$ } from "@builder.io/qwik";
import {
	QwikCityProvider,
	RouterOutlet,
	ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { DarkThemeLauncher } from "./components/dark-theme-launcher";

import "./global.css";

export default component$(() => {
	/**
	 * The root of a QwikCity site always start with the <QwikCityProvider> component,
	 * immediately followed by the document's <head> and <body>.
	 *
	 * Dont remove the `<head>` and `<body>` elements.
	 */

	return (
		<QwikCityProvider>
			<head>
				<meta charSet="utf-8" />
				<link rel="manifest" href="/manifest.json" />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
					rel="stylesheet"
				/>
				<RouterHead />
				<DarkThemeLauncher />
			</head>
			<body
				class="antialiased bg-white dark:bg-gray-900 dark:text-slate-300 text-gray-900 tracking-tight"
				lang="en"
			>
				<RouterOutlet />
				<ServiceWorkerRegister />
			</body>
		</QwikCityProvider>
	);
});
