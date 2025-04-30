import { upgradeBrew } from "@/lib/brew.lib";
import { upgradeNpm } from "@/lib/node.lib";
import { upgradePipxPackages } from "@/lib/python.lib";
import { logger } from "@/lib/logger.lib";
import { $ } from "bun";

export async function upgradeAll() {
	logger.info("Upgrading brew packages...");
	await upgradeBrew();
	logger.info("Upgrading npm packages...");
	await upgradeNpm();
	logger.info("Upgrading python packages...");
	await upgradePipxPackages();
}
