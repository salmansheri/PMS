export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message || `HTTP error ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      try {
        errorBody = await response.text();
      } catch {
        errorBody = null;
      }
    }
    const errorMessage =
      errorBody && typeof errorBody === "object" && "message" in errorBody
        ? (errorBody as { message: string }).message
        : undefined;
    throw new HttpError(response.status, errorBody, errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
