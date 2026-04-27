export async function sendChat(query: string, queryType = 'General') {
  const res = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, query_type: queryType }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Server error: ${res.status} ${txt}`);
  }
  return res.json();
}
