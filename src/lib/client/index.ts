import { createClient } from "microcms-ts-sdk";
import env from "@/env";

const client = createClient<MicroCMS.Endpoints>({
  apiKey: env.MICRO_CMS_API_KEY,
  serviceDomain: env.MICRO_CMS_SERVICE_DOMAIN,
});

export default client;
