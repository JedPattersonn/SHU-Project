import { createAuthClient } from "better-auth/react";
import { twoFactorClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [twoFactorClient(), adminClient()],
});
