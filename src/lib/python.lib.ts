import { $ } from "bun";
import { logger } from "@/lib/logger.lib";

export async function upgradePipxPackages(): Promise<boolean> {
	try {
		const proc = await $`pipx upgrade-all`;
		return proc.text().length > 0;
	} catch (error) {
		logger.warn("skipping pipx upgrade as pipx is not installed");
		return false;
	}
}
