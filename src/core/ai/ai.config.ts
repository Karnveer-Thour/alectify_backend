import { ConfigType, registerAs } from '@nestjs/config';

export interface AIConfigInterface {
  AIApiKey: string;
}

export const AI_CONFIG = 'AI_CONFIG';

export const AIConfig = registerAs<AIConfigInterface>(AI_CONFIG, () => {
  const {
    env: { AI_API_KEY },
  } = process;

  return {
    AIApiKey: AI_API_KEY,
  };
});

export type AIConfigType = ConfigType<typeof AIConfig>;
