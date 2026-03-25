const express = require('express');
const cors = require('cors');
const OpenAI = require('openai').default;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.post('/api/complete', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }

  if (!openai) {
    return res.status(503).json({
      error: 'LLM not configured',
      hint: 'Set OPENAI_API_KEY environment variable and restart the server.',
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a workflow assistant. The user describes what they want to create. 
Expand their brief idea into a clear, detailed workflow description in 1-2 sentences.
Focus on: what media (images, video, etc.), what style, what inputs they need.
Output only the expanded description, no preamble.`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content?.trim() || prompt;
    res.json({ text });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({
      error: err.message || 'LLM request failed',
    });
  }
});

app.post('/api/improve-prompt', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }

  if (!openai) {
    return res.status(503).json({
      error: 'LLM not configured',
      hint: 'Set OPENAI_API_KEY environment variable.',
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a prompt improvement assistant for AI image and video generation. 
Analyze the user's prompt and improve it to be more detailed, specific, and effective for generating high-quality outputs.
Add relevant details about: style, lighting, composition, mood, and any specific visual elements.
Keep the improved prompt concise (1-3 sentences). Output only the improved prompt, no preamble or explanation.`,
        },
        { role: 'user', content: prompt.trim() },
      ],
      max_tokens: 300,
      temperature: 0.6,
    });

    const text = completion.choices[0]?.message?.content?.trim() || prompt;
    res.json({ text });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({
      error: err.message || 'Prompt improvement failed',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (!openai) {
    console.warn('OPENAI_API_KEY not set — LLM endpoint will return 503');
  }
});
