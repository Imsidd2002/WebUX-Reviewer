# AI Implementation Notes

## Why Groq?
We chose **Groq** for this project because:
1. **Speed**: Groq's LPU inference engine provides near-instant responses, which is critical for a real-time "Review" experience. Users expect the audit to be generated quickly after scraping.
2. **Cost/Performance**: The `llama-3.1-70b-versatile` model offers GPT-4 class performance at a much lower latency and cost point for this specific task (structured JSON generation).
3. **Structured Output**: Llama 3.3 follows system prompts well, ensuring the JSON output for the review matches our strict schema (Score, Issues, Categories).

## AI Workflow
1. **Scraping**: We feed the raw text content (headings, buttons, main body) into the prompt. We limit this to ~4000 characters to fit within context windows and focus on the "above the fold" or main content.
2. **Prompt Engineering**:
   - We use a `system` role to enforce the JSON structure.
   - We explicitly ask for "Before/After" examples for the top 3 issues to make the feedback actionable.
   - We ask for a specific numerical score (0-100) based on heuristics (Accessibility, Trust, Layout).

## Future Improvements
- **Vision Capabilities**: Currently, we analyze text. Using Llama 3.2 Vision or GPT-4o could allow analyzing screenshots for visual hierarchy issues.
- **Custom embeddings**: Retaining past reviews to compare against industry benchmarks.
