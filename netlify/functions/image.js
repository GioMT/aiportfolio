exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const HF_API_TOKEN = process.env.HF_API_TOKEN;
  if (!HF_API_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server misconfigured: HF_API_TOKEN not set' })
    };
  }

  try {
    const { inputs } = JSON.parse(event.body);

    const response = await fetch(
      // ✅ Updated to the new Hugging Face inference router
      'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs }),
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      let msg = 'Image generation failed';
      try { msg = JSON.parse(txt).error || msg; } catch {}
      if (response.status === 503) msg = 'Model is warming up — please try again in a moment.';
      return { statusCode: response.status, body: JSON.stringify({ error: msg }) };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/png';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ image: base64, contentType }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
