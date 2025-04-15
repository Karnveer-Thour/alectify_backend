import { AxiosRequestConfig } from 'axios';

type OmittedProperties = 'url' | 'data' | 'baseURL' | 'method';
export interface IHttpRequestConfig
  extends Omit<AxiosRequestConfig, OmittedProperties> {
  observe?: 'response' | 'data';
}

export interface IHttpRequestConfigWithObserveData extends IHttpRequestConfig {
  observe?: 'data';
}

export interface IHttpRequestConfigWithObserveResponse
  extends IHttpRequestConfig {
  observe?: 'response';
}
