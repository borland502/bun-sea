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
}
