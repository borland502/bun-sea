import { $ } from "bun";

export async function upgradeNpm() {
	const result = await $`bunx npm-check-updates -g --upgrade --target latest`;
	if (result.exitCode !== 0) {
		throw new Error("Failed to upgrade npm packages");
	}
}
