export async function proxyAsk(question: string, context: string, jwt: string) {
  const res = await fetch('http://127.0.0.1:5000/ask', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', Authorization:`Bearer ${jwt}` },
    body: JSON.stringify({ q: question, c: context })
  });
  return res.text();                  // stream or whole text
}
