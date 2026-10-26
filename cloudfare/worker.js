import { onRequestPost } from "./functions/api/enquiries.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/enquiries") {
      if (request.method !== "POST") {
        return Response.json(
          { error: "Method not allowed." },
          {
            status: 405,
            headers: { Allow: "POST" }
          }
        );
      }

      return onRequestPost({ request, env });
    }

    return env.ASSETS.fetch(request);
  }
};
