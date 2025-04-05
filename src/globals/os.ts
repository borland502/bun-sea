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
