import ENVS from "@/envs";

export default (seconds: number) => ENVS.DEBUG ? new Promise((r) => setTimeout(() => r(1), seconds * 1000)) : Promise.resolve();