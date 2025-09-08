export function mapModelName(alainModel: string): string {
  const key = (alainModel || '').toLowerCase();
  const modelMap: Record<string, string> = {
    // GPT-OSS teacher models
    'gpt-oss-20b': 'GPT-OSS-20B',
    'gpt-oss-120b': 'GPT-OSS-120B',

    // Popular Poe models
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o-mini',
    'claude-3.5-sonnet': 'Claude-3.5-Sonnet',
    'claude-3-haiku': 'Claude-3-Haiku',
    'gemini-1.5-pro': 'Gemini-1.5-Pro',
    'gemini-1.5-flash': 'Gemini-1.5-Flash',
    'grok-2': 'Grok-2',
    'llama-3.1-405b': 'Llama-3.1-405B',
  };

  return modelMap[key] || 'GPT-4o-mini';
}

