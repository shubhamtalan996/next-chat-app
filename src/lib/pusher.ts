import PusherServer from "pusher";
import PusherClient from "pusher-js";

type PusherServerInstance = InstanceType<typeof PusherServer>;
type PusherClientInstance = InstanceType<typeof PusherClient>;

let serverInstance: PusherServerInstance | null = null;
let clientInstance: PusherClientInstance | null = null;

const CLUSTER = "ap2";

/**
 * Lazily create the server-side Pusher client.
 *
 * Constructing this at module scope makes `next build` fail while collecting
 * route config whenever the credentials are absent (e.g. a preview deployment
 * without environment variables), so it is deferred to first use.
 */
export function getPusherServer(): PusherServerInstance {
  if (!serverInstance) {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const secret = process.env.PUSHER_APP_SECRET;

    if (!appId || !key || !secret) {
      throw new Error(
        "Pusher server credentials are not configured (PUSHER_APP_ID, NEXT_PUBLIC_PUSHER_KEY, PUSHER_APP_SECRET).",
      );
    }

    serverInstance = new PusherServer({
      appId,
      key,
      secret,
      cluster: CLUSTER,
      useTLS: true,
    });
  }

  return serverInstance;
}

/**
 * Lazily create the browser-side Pusher client. Only ever called from effects,
 * so it never runs during server rendering.
 */
export function getPusherClient(): PusherClientInstance {
  if (!clientInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;

    if (!key) {
      throw new Error("NEXT_PUBLIC_PUSHER_KEY is not configured.");
    }

    clientInstance = new PusherClient(key, { cluster: CLUSTER });
  }

  return clientInstance;
}
