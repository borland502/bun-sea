import "globals";

import { Command } from "commander";
import { logger, upgradeBrew } from "@/lib";
import { upgradeAll } from "@/scripts/upgrade";
import { isProgramInstalled } from "./globals/os";

export const program = new Command();

program
	.name("sysupdate")
	.description("Update system packages")
	.version("0.0.1");

const upgrade = program
	.command("upgrade")
	.description("Upgrade system packages");

// Sub-command for upgrading all packages
upgrade
	.command("all")
	.description("Upgrade everything")
	.action(async () => {
		logger.info("Upgrading everything...");
		upgradeAll();
	});

upgrade
	.command("brew")
	.description("Upgrade brew packages")
	.action(async () => {
		logger.info("Upgrading brew packages...");
		await upgradeBrew();
	});

program.parse(process.argv);
