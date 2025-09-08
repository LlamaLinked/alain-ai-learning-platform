import { describe, it, expect } from 'vitest';
import { mapModelName } from './model-map';

describe('mapModelName', () => {
  it('maps GPT-OSS models regardless of case', () => {
    expect(mapModelName('gpt-oss-20b')).toBe('GPT-OSS-20B');
    expect(mapModelName('GPT-OSS-20B')).toBe('GPT-OSS-20B');
    expect(mapModelName('gPt-Oss-120B')).toBe('GPT-OSS-120B');
  });

  it('maps popular Poe models', () => {
    expect(mapModelName('gpt-4o')).toBe('GPT-4o');
    expect(mapModelName('gpt-4o-mini')).toBe('GPT-4o-mini');
    expect(mapModelName('ClAuDe-3.5-SoNnEt')).toBe('Claude-3.5-Sonnet');
    expect(mapModelName('claude-3-haiku')).toBe('Claude-3-Haiku');
    expect(mapModelName('gemini-1.5-pro')).toBe('Gemini-1.5-Pro');
    expect(mapModelName('gemini-1.5-flash')).toBe('Gemini-1.5-Flash');
    expect(mapModelName('grok-2')).toBe('Grok-2');
    expect(mapModelName('llama-3.1-405b')).toBe('Llama-3.1-405B');
  });

  it('falls back to GPT-4o-mini for unknown models', () => {
    expect(mapModelName('unknown-model')).toBe('GPT-4o-mini');
    expect(mapModelName('')).toBe('GPT-4o-mini');
  });
});

