import { Observable } from 'rxjs';
import { HttpMethod } from './axios-method-names.model';
import {
  IHttpRequestConfig,
  IHttpRequestConfigWithObserveData,
  IHttpRequestConfigWithObserveResponse,
} from './http-request-config.model.interface';
import { HttpResponse } from './http-response.model';

export interface HttpWrapperInterface {
  request<T, U = any>(
    method: HttpMethod,
    url: string,
    config: Partial<Record<'body', U>> & IHttpRequestConfigWithObserveData,
  ): Observable<T>;
  request<T, U = any>(
    method: HttpMethod,
    url: string,
    config: Partial<Record<'body', U>> & IHttpRequestConfigWithObserveResponse,
  ): Observable<HttpResponse<T>>;
  request<T, U = any>(
    method: HttpMethod,
    url: string,
    options: Partial<Record<'body', U>> & IHttpRequestConfig,
  ): Observable<HttpResponse<T> | T>;

  get<T>(url: string, config: IHttpRequestConfigWithObserveData): Observable<T>;
  get<T>(
    url: string,
    config: IHttpRequestConfigWithObserveResponse,
  ): Observable<HttpResponse<T>>;
  get<T>(
    url: string,
    config: IHttpRequestConfig,
  ): Observable<HttpResponse<T> | T>;

  post<T, U>(
    url: string,
    data: U,
    config: IHttpRequestConfigWithObserveData,
  ): Observable<T>;
  post<T, U>(
    url: string,
    data: U,
    config: IHttpRequestConfigWithObserveResponse,
  ): Observable<HttpResponse<T>>;
  post<T, U>(
    url: string,
    data: U,
    config: IHttpRequestConfig,
  ): Observable<HttpResponse<T> | T>;
}
