import { $ } from "bun";
import type { PathLike } from "fs";

export async function ensurePath(path: PathLike) {
	const exists = await $`test -e ${path}`;
	if (exists.exitCode === 0) {
		return;
	}
	await $`mkdir -p ${path}`;
}

export async function ensureCache() {
	const cacheDir = process.env.XDG_CACHE_HOME
		? `${process.env.XDG_CACHE_HOME}/sysinfo`
		: `${process.env.HOME}/.cache/sysinfo`;

	await ensurePath(cacheDir);
	return cacheDir;
}
