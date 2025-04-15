import { ConfigType, registerAs } from '@nestjs/config';

export interface llmApisInterface {
  llmUrl: string;
}

export const LLM_API_CONFIG = 'LLM_API_CONFIG';

export const LLMAPIsConfig = registerAs<llmApisInterface>(
  LLM_API_CONFIG,
  () => {
    const {
      env: { LLM_URL },
    } = process;

    return {
      llmUrl: LLM_URL,
    };
  },
);
export type LLMAPIsConfigType = ConfigType<typeof LLMAPIsConfig>;
