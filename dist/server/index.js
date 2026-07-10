const HTML_FALLBACK = "/index.html";

function isAssetRequest(pathname) {
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

async function fetchAsset(env, request, pathname) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const directResponse = await fetchAsset(env, request, url.pathname);
    if (directResponse.status !== 404) {
      return directResponse;
    }

    if (isAssetRequest(url.pathname)) {
      return directResponse;
    }

    const fallbackResponse = await fetchAsset(env, request, HTML_FALLBACK);
    if (fallbackResponse.status !== 404) {
      return fallbackResponse;
    }

    return new Response("Not found", { status: 404 });
  },
};