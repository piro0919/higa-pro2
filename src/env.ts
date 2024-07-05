import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  client: {},
  experimental__runtimeEnv: {},
  server: {
    MICRO_CMS_API_KEY: z.string().min(1),
    MICRO_CMS_SERVICE_DOMAIN: z.string().min(1),
    NODEMAILER_AUTH_PASS: z.string().min(1),
    NODEMAILER_AUTH_USER: z.string().min(1),
  },
});

export default env;
