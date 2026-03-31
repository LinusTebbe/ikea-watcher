import { UserSettings } from "./interfaces.ts";
import { checkUpdateForSettings, getAllStores } from "./helpers.ts";

const stores = await getAllStores();

for (const file of Deno.readDirSync("./data/settings")) {
  if (!file.name.endsWith(".json")) continue;
  const discordId = file.name.substring(0, file.name.length - 5);
  const content = Deno.readTextFileSync(`./data/settings/${file.name}`);
  const settings = JSON.parse(content) as UserSettings;

  await checkUpdateForSettings(discordId, settings, stores);
}
