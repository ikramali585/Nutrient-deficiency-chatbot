# API Flow Short Notes

## Main Idea
- UI calls service files.
- Service files call API client.
- API client uses `axios` for real APIs.

## File Flow
1. `src/App.jsx`
   - Handles UI state, loading, and errors.
   - Calls:
     - `analyzeCropImage(file)` on image upload
     - `sendAgriBotMessage(...)` on chat send

2. `src/api/analysisApi.js`
   - Calls `apiClient.analyzeImage(file)`
   - Maps backend data for UI result card

3. `src/api/chatApi.js`
   - Calls `apiClient.sendChat(payload)`
   - Returns chatbot reply text

4. `src/api/client.js`
   - Axios setup and endpoint calls
   - Base URL from `.env`:
     - `VITE_API_BASE_URL`
   - Endpoints:
     - `POST /analyze`
     - `POST /chat`
   - Mock/real switch:
     - `USE_MOCK_API = true` (mock)
     - `USE_MOCK_API = false` (real API)

## Quick Setup for Real API
- Put in `.env`:
  - `VITE_API_BASE_URL=https://your-api-domain.com/api`
- In `src/api/client.js`:
  - Set `USE_MOCK_API = false`

