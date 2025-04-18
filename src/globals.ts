import * as globals from "@/index";
import type { Systeminformation } from "systeminformation";

Object.assign(globalThis, {
	...globals,
});

export type SystemInformation = Systeminformation.StaticData &
	Systeminformation.DynamicData;

declare global {
	const $: typeof globals.$;
	const ensurePath: typeof globals.ensurePath;
	const ensureCache: typeof globals.ensureCache;
	const sysdata: SystemInformation;
	const versions: SystemInformation["versions"];
	const osdata: SystemInformation["os"];
	const isProgramInstalled: typeof globals.isProgramInstalled;
	const getPackageManager: typeof globals.getPackageManager;
}
