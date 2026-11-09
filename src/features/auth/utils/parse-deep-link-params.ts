export type DeepLinkParams = Record<string, string | string[] | undefined>;

export function parseDeepLinkParams(url: string | null): DeepLinkParams {
  if (!url) {
    return {};
  }

  try {
    const parsedUrl = new URL(url);
    const params: DeepLinkParams = {};

    parsedUrl.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // PKCE replies arrive in the query string. The fragment is parsed as a
    // fallback for links that still deliver tokens through the implicit flow.
    if (parsedUrl.hash.length > 1) {
      new URLSearchParams(parsedUrl.hash.slice(1)).forEach((value, key) => {
        if (!(key in params)) {
          params[key] = value;
        }
      });
    }

    return params;
  } catch {
    return {};
  }
}
