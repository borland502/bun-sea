import { $ } from "bun";
import { logger } from "./logger.lib";

export async function initBrew() {
	const brew = await $`which brew`;
	if (brew.exitCode !== 0) {
		throw new Error("Brew is not installed");
	}

	const update = await $`brew update`;
	if (update.exitCode !== 0) {
		throw new Error("Failed to update brew");
	}
}

export async function upgradeBrew() {
	try {
		await initBrew();
	} catch (error) {
		logger.error("Skipping brew upgrade");
		return;
	}

	const upgrade = await $`brew upgrade`;
	if (upgrade.exitCode !== 0) {
		throw new Error("Failed to upgrade brew");
	}

	const cleanup = await $`brew cleanup`;
	if (cleanup.exitCode !== 0) {
		throw new Error("Failed to cleanup brew");
	}
}
