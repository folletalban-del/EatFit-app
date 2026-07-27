export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('DIAGNOSTIC clé API — présente:', !!apiKey, '| longueur:', apiKey ? apiKey.length : 0, '| début:', apiKey ? apiKey.slice(0, 12) : 'aucune');
  if (!apiKey) {
    res.status(500).json({ error: 'Clé API non configurée sur le serveur' });
    return;
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await anthropicRes.json();
    res.status(anthropicRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erreur de connexion à l\'API Anthropic' });
  }
}
