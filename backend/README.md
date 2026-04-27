# Backend Setup

## Quick Start

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. (Optional) Add API keys:
   - Copy `.env.example` to `.env`
   - Add OpenAI API key for real chat responses
   - Add OpenWeatherMap API key for real weather data

4. Start the backend:
   ```bash
   python main.py
   ```
   Backend runs on `http://localhost:8000`

5. Start the frontend (new terminal):
   ```bash
   npm run dev
   ```

## API Keys (Optional)

- **OpenAI API Key**: Get from https://platform.openai.com/api-keys
  - Without it: Chat shows demo responses
  
- **OpenWeatherMap API Key**: Get free key at https://openweathermap.org/api
  - Without it: Weather shows demo data

## Verify Backend is Running

Visit: http://localhost:8000

Should see: `{"message":"MLIMI Smart API is running","status":"healthy"}`

## Troubleshooting

- **Port 8000 already in use?** Change the port at the bottom of `main.py`
- **Module not found?** Run `pip install -r requirements.txt` again
- **Frontend can't connect?** Make sure backend is running on port 8000
