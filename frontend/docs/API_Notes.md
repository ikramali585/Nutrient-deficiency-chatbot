# RCND API Notes (Easy English)

## 1. What is happening now

Your app is using **dummy (mock) APIs** for testing.

- File: `src/api/client.js`
- There is a switch: `USE_MOCK_API = true`
- Because it is `true`, fake data is returned.

So right now:
- Image upload gives fake analysis result.
- Chatbot gives fake reply based on that analysis.

---

## 2. How data moves in this project

### Image upload flow
1. User uploads image in UI.
2. `App.jsx` calls `analyzeCropImage(file)`.
3. `analysisApi.js` calls `apiClient.analyzeImage(file)`.
4. `client.js` returns mock analysis data.
5. Result is shown in Result card.
6. Detailed analysis text is also sent to chatbot message list.

### Chat flow
1. User types question in chatbot.
2. `App.jsx` calls `sendAgriBotMessage(...)`.
3. `chatApi.js` calls `apiClient.sendChat(...)`.
4. `client.js` returns mock chatbot reply.
5. Reply is shown in chat.

---

## 3. Important files (simple)

- `src/App.jsx`
  - Controls state, loading, and message updates.

- `src/api/client.js`
  - Main API client.
  - Contains mock mode and real mode switch.

- `src/api/analysisApi.js`
  - Prepares analysis data for UI.

- `src/api/chatApi.js`
  - Sends chat request and returns chatbot text.

---

## 4. When you get original APIs

## Step 1
Open `src/api/client.js`.

## Step 2
Change:
- `USE_MOCK_API = false`

## Step 3
Replace these two functions with real API calls:
- `analyzeImage(file)`
- `sendChat(payload)`

---

## 5. Example real API code (simple)

```js
async analyzeImage(file) {
  const form = new FormData()
  form.append('image', file)

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/analyze`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) throw new Error('Analysis API failed')
  return res.json()
}
```

```js
async sendChat(payload) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('Chat API failed')
  return res.json()
}
```

---

## 6. Add environment variable

Create `.env` file:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

---

## 7. Simple safety checks

- Show error message if API fails.
- Keep loading indicator while waiting.
- Validate image size/type before sending.
- Keep mock mode for demo/testing.

---

## 8. Quick summary

- Now app uses mock APIs.
- Later, only `client.js` needs real endpoint code.
- Keep `App.jsx`, `analysisApi.js`, `chatApi.js` structure same.

