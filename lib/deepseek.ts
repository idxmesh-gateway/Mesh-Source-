import OpenAI from 'openai';

export const deepseek = new OpenAI({
  apiKey: process.env.MODEL_API_KEY!,
  baseURL: 'https://api.deepseek.com',
});

// deepseek-flash peak pricing (USD per 1M tokens)
const PEAK_INPUT_MISS = 0.3;
const PEAK_INPUT_HIT = 0.006;
const PEAK_OUTPUT = 1.2;

export function calculateCost(usage: {
  prompt_cache_miss_tokens: number;
  prompt_cache_hit_tokens: number;
  completion_tokens: number;
}): number {
  const inputMiss = (usage.prompt_cache_miss_tokens / 1_000_000) * PEAK_INPUT_MISS;
  const inputHit = (usage.prompt_cache_hit_tokens / 1_000_000) * PEAK_INPUT_HIT;
  const output = (usage.completion_tokens / 1_000_000) * PEAK_OUTPUT;
  return inputMiss + inputHit + output;
}

export function deductAmount(cost: number): number {
  return cost * 20;
}
