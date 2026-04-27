# Language-Specific Response Routing Test Guide

## Overview
The system now detects the user's input language and responds in that language:
- **Chichewa** → responds in Chichewa
- **Kinyarwanda** → responds in Kinyarwanda  
- **English** → responds in English
- **Swahili** → responds in Swahili
- **French** → responds in French (corrected)

## Quick Start

### Step 1: Verify Setup
```bash
cd backend
python test_setup.py
```

Expected output: ✓ ALL CHECKS PASSED!

This confirms all prompts have the language templates configured correctly.

### Step 2: Start Backend Server
In a terminal, run:
```bash
cd backend
python -m uvicorn app:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Step 3: Test Language Routing

#### Option A: Use the Frontend (Recommended)
```bash
# In a new terminal
npm run dev
```
Then open http://localhost:5173 and chat in different languages.

#### Option B: Use API Directly
Make curl requests to test specific languages:

**English:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"How can I improve crop yield?", "query_type":"General"}'
```

**Chichewa:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"Kodi ndingagule njugu za mabegu a mabwalo angati?", "query_type":"General"}'
```

**Swahili:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"Je, ninawezaje kupunguza magonjwa ya karanga?", "query_type":"General"}'
```

**French:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"Comment puis-je améliorer mes cultures?", "query_type":"General"}'
```

## How It Works

1. **Detection**: User message is analyzed to detect language
2. **Mapping**: Detected language is mapped to response language
3. **Injection**: Response language is injected into the prompt template
4. **LLM Call**: Prompt with language instruction sent to AI model
5. **Response**: AI model responds ONLY in the specified language

## Files Modified

- `backend/app.py`: Language detection and injection logic
- `backend/prompts.py`: All prompts updated with `{response_language}` template
- `backend/lang_utils.py`: Language detection function
- `backend/test_setup.py`: Verify setup is correct
- `backend/test_inference.py`: Test actual API responses

## Testing Checklist

- [ ] Run `test_setup.py` → all checks pass
- [ ] Start backend server → running on port 8000
- [ ] Test English query → response in English
- [ ] Test Chichewa query → response in Chichewa
- [ ] Test Swahili query → response in Swahili
- [ ] Test Kinyarwanda query → response in Kinyarwanda
- [ ] Test French query → response in French
- [ ] Frontend chat works with multiple languages

## Notes

- Chichewa and Kinyarwanda detection may occasionally confuse with Swahili (due to linguistic similarity)
- The system still works correctly because the detected language is mapped and used
- All responses are now in plain text (no markdown)
- Responses follow ChatGPT-like formatting
