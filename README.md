# AI Infographic Designer (Internal Tool)

## Setup

1. Clone or copy this project folder
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your API keys
4. Run `npm start`
5. Open http://localhost:3000 in your browser

## API Keys Required

- `OPENROUTER_API_KEY` from https://openrouter.ai
- `OPENROUTER_MODEL` recommended: `anthropic/claude-3.5-sonnet`
- `KIE_API_KEY` from https://kie.ai/api-key

## Usage

1. Describe your infographic topic in the text field
2. Select an art style from the grid
3. Choose resolution and aspect ratio
4. Click "Refine Prompt" and wait for the LLM to generate an optimised prompt
5. Review and edit the prompt as needed
6. Click "Copy Prompt" to save it for your records
7. Click "Generate Image" to send to Nano Banana Pro
8. Download the result when it appears

## Notes

- Image generation typically takes 30 to 90 seconds
- Higher resolutions (4K) take longer to generate
- The refined prompt textarea is fully editable before generation
- Downloaded files are named automatically with date, time, style, and aspect ratio
