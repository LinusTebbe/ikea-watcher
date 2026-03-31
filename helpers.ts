import { REST } from "npm:@discordjs/rest";
import { Routes } from "npm:discord-api-types/rest";
import { DMChannel, EmbedBuilder } from "npm:discord.js";
import {
  IkeaProduct,
  IkeaResponse,
  IkeaStore,
  State,
  UserSettings,
} from "./interfaces.ts";
import { load } from "jsr:@std/dotenv";
const env = await load();
const rest = new REST().setToken(env.BOT_TOKEN);

const getProducts = async (
  storeIds: number[],
  searchTerm: string,
  page: number = 0,
): Promise<IkeaProduct[]> => {
  const response = (await fetch(
    `https://web-api.ikea.com/circular/circular-asis/offers/grouped/search?languageCode=de&size=32&storeIds=${
      encodeURI(storeIds.join(","))
    }&query=${encodeURI(searchTerm)}&page=${page}`,
  ).then((res) => res.json())) as IkeaResponse;
  if (response.totalPages > page) {
    return [
      ...response.content,
      ...(await getProducts(storeIds, searchTerm, page + 1)),
    ];
  }
  return response.content;
};

const formatPrice = (price: number): string => {
  return price.toLocaleString("de-DE", { style: "currency", currency: "EUR" })
    .replace(".", ",");
};

const getStore = (stores: IkeaStore[], id: string): IkeaStore | undefined => {
  return stores.find((store) => store.id === id);
};

const getFormattedStore = (store: IkeaStore|undefined): string => {
  if (store === undefined) return "Unknown";
  return `[${store.displayName}](https://www.google.com/maps/place/${store.lat},${store.lng})`;
};

const getState = (discordId: string): State => {
  try {
    const content = Deno.readTextFileSync(`./data/state/${discordId}.json`);
    return JSON.parse(content) as State;
  } catch (e) {
    console.log(e);
    return { previousOffers: [] };
  }
};

export const checkUpdateForSettings = async (
  discordId: string,
  settings: UserSettings,
  stores: IkeaStore[],
) => {
  const dmChannel = await rest.post(Routes.userChannels(), {
    body: {
      recipient_id: discordId,
    },
  }) as DMChannel;

  const state = getState(discordId);

  for (const searchTerm of settings.searchTerms) {
    const products = await getProducts(settings.storeIds, searchTerm);
    for (const product of products) {
      const store = getStore(stores, product.storeId);
      for (const offer of product.offers) {
        if (state.previousOffers.includes(offer.offerNumber)) continue;
        const embed = new EmbedBuilder()
          .setColor(0x32a852)
          .setTitle(product.title)
          .setURL(
            `https://www.ikea.com/de/de/second-hand/buy-from-ikea/#/${store?.displayName.toLowerCase() ?? '.'}/${offer.offerNumber}`,
          )
          .setDescription(product.description)
          .setThumbnail(product.heroImage)
          .setFields(
            { name: "New Price", value: formatPrice(offer.price), inline: true },
            {
              name: "Original Price",
              value: formatPrice(product.originalPrice),
              inline: true,
            },
            {
              name: "Store",
              value: getFormattedStore(store),
            },
            {
              name: "Reduction Reason",
              value: offer.reasonDiscount,
            },
            {
              name: "Product Condition",
              value: offer.productConditionTitle,
            },
          )
          .setTimestamp();

        await rest.post(Routes.channelMessages(dmChannel.id), {
          body: {
            embeds: [embed],
          },
        });
        state.previousOffers.push(offer.offerNumber);
      }
    }
  }

  await Deno.writeTextFile(
    `./data/state/${discordId}.json`,
    JSON.stringify(state),
  );
};

export const getAllStores = async (): Promise<IkeaStore[]> => {
  return await fetch(
    "https://www.ikea.com/de/de/meta-data/informera/stores-suggested.json",
  )
    .then((res) => res.json()) as IkeaStore[];
};
