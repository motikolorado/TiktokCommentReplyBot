import { sleep } from "./sleep";

export async function randomSleep(min = 500, max = 2000) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return sleep(ms);
}
