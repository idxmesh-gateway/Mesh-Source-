import OpenAI from 'openai';

export const MODEL_NAME = process.env.MODEL_NAME ?? 'deepseek-chat';

export const deepseek = new OpenAI({
  apiKey: process.env.MODEL_API_KEY!,
  baseURL: 'https://api.deepseek.com',
  timeout: 55000,
  maxRetries: 1,
});

// Verify these against DeepSeek's current pricing for MODEL_NAME.
// USD per 1M tokens — peak hours. Off-peak is 50%.
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

export const MULTIPLIER = 20;

export function deductAmount(cost: number): number {
  return cost * MULTIPLIER;
}
