import paths from "@/paths";

export type GQLError = { message: string };

export async function gql<T = any>(query: string, variables?: Record<string, any>, opts?: { adminToken?: string }) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (opts?.adminToken) headers['x-admin-token'] = opts.adminToken;
  const res = await fetch(paths.ApiGraphqlEndpoint(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  const ctype = res.headers.get('content-type') || '';
  if (!ctype.includes('application/json')) {
    const text = await res.text();
    const snippet = text.slice(0, 200).replace(/\s+/g, ' ').trim();
    throw new Error(`GraphQL HTTP ${res.status}: ${snippet || 'Non-JSON response'}`);
  }
  const json = await res.json();
  if (!res.ok || json.errors) {
    const msg = json.errors?.[0]?.message || `GraphQL error (${res.status})`;
    throw new Error(msg);
  }
  return json.data as T;
}
