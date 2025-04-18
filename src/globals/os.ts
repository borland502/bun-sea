import { getAllData } from "systeminformation";

export const sysdata = await getAllData();
export const versions = data.versions;
export const osdata = data.os;


/**
 * Determines if a given program is installed on the OS.
 *
 * @param program - The name of the program (e.g., "node", "git")
 * @returns A Promise that resolves to true if the program is installed, false otherwise.
 */
export async function isProgramInstalled(program: string): Promise<boolean> {
	try {
		const output = await $`command -v ${program}`.quiet().text();
		return output.trim().length > 0;
	} catch {
		return false;
	}
}

/**
 * Determine package manager
 *
 * @returns {Promise<string>} - The package manager name (e.g., "brew", "apt", "yum", "dnf", "pacman")
 */
export async function getPackageManager(): Promise<string> {
	if (await isProgramInstalled("brew")) {
		return "brew";
	} else if (await isProgramInstalled("apt")) {
		return "apt";
	} else if (await isProgramInstalled("yum")) {
		return "yum";
	} else if (await isProgramInstalled("dnf")) {
		return "dnf";
	} else if (await isProgramInstalled("pacman")) {
		return "pacman";
	} else {
		throw new Error("Unsupported package manager");
	}
}
