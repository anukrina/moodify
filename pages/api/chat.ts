import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fallback if no key is configured
    return res.status(200).json({ reply: '💡 (Local) Thanks for sharing. I’m here with you. Try a deep breath or jotting a few thoughts—small steps help.' });
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a kind, empathetic AI mood companion. Always respond supportively, never judgmentally. Keep replies short (2–4 sentences). Avoid clinical diagnoses. Offer gentle, actionable suggestions (breathing, journaling, short walk).',
          },
          ...(Array.isArray(history) ? history.map((m: any) => ({
            role: m?.sender === 'You' ? 'user' : 'assistant',
            content: typeof m?.text === 'string' ? m.text : '',
          })) : []),
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('OpenAI error:', resp.status, text);
      return res.status(200).json({ reply: '⚠️ Sorry, I had trouble generating a response. Try again in a moment.' });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content || 'I’m here for you 💙';
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('API error:', error);
    return res.status(200).json({ reply: '⚠️ Sorry, I had trouble generating a response. Try again in a moment.' });
  }
}
