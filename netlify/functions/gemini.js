exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server misconfigured: GEMINI_API_KEY not set' }),
    };
  }

  try {
    const { system, prompt } = JSON.parse(event.body);

    const payload = {
      system_instruction: system ? { parts: [{ text: system }] } : undefined,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1500, temperature: 0.9 },
    };

    const model = 'gemini-3.1-pro-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = (err.error && err.error.message) || ('Gemini API error ' + response.status);
      return { statusCode: response.status, body: JSON.stringify({ error: msg }) };
    }

    // Pass the SSE stream straight through to the browser
    const body = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
