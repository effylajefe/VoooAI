# VoooAI — AI Multi-Media Generation

## LLM Integration

The workflow prompt field uses an LLM to expand your ideas into detailed workflow descriptions.

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set your OpenAI API key**
   ```bash
   export OPENAI_API_KEY="sk-your-key-here"
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open the app** — Serve the HTML files (e.g. with a local server or open `index.html`). The workflow page will call `http://localhost:3001/api/complete` when you submit a prompt.

### Behavior

- **With server running + API key**: Your prompt is sent to GPT-4o-mini, which expands it into a clearer workflow description. The workflow is then generated from that.
- **Without server or on error**: Falls back to using your original prompt directly (same as before).

### Image & Video Generation

When you click **Workflow ready** (Run), the workflow executes and calls real APIs:

- **Images**: DALL-E 3 via OpenAI (uses `OPENAI_API_KEY`)
- **Videos**: Runway Gen-3 / Veo3 (uses `RUNWAY_API_KEY`)

Set both keys for full functionality:

```bash
export OPENAI_API_KEY="sk-your-key-here"
export RUNWAY_API_KEY="your-runway-key-here"
npm start
```

- Without `OPENAI_API_KEY`: Image engines will return 503.
- Without `RUNWAY_API_KEY`: Video engines will return 503.

### Custom API URL

Edit `LLM_API_URL` and `API_BASE` in `workflow.html` if your server runs on a different host/port.
