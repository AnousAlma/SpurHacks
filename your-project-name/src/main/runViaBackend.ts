// main/runViaBackend.ts
export async function runViaBackend(
  lang: string, src: string, token: string
) {
  const res = await fetch('http://127.0.0.1:5000/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,      // <- pass it on
    },
    body: JSON.stringify({ lang, src }),
  });
  return res.text();
}
