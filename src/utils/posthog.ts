import { PostHog } from "posthog-node";
import { POSTHOG_API_KEY } from "./env";

export const postHog = new PostHog(
    POSTHOG_API_KEY!,
    {
        host: 'https://us.i.posthog.com',
        flushAt: 1,                      
    }
)