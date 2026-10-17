// Minimal GitHub GraphQL client (replaces apollo-boost + graphql, ~30 KB gzipped, for two queries).
export async function githubGraphQL(query, token) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed with HTTP ${response.status}`);
  }
  const payload = await response.json();
  if (payload.errors && payload.errors.length) {
    throw new Error(payload.errors.map((e) => e.message).join("; "));
  }
  return payload.data;
}
