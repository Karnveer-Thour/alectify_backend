import { HttpService } from '@nestjs/axios';
import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpMethod } from './models/axios-method-names.model';
import { HttpError } from './models/http-error.model';
import {
  IHttpRequestConfig,
  IHttpRequestConfigWithObserveData,
  IHttpRequestConfigWithObserveResponse,
} from './models/http-request-config.model.interface';
import { HttpResponse } from './models/http-response.model';
import { PartialBody } from './models/partial-body.model';
import { HttpWrapperInterface } from './models/request-function.model';

@Injectable()
export class HttpWrapper implements HttpWrapperInterface {
  constructor(private readonly http: HttpService) {}

  get axiosRef() {
    return this.http.axiosRef;
  }

  request<T, U = any>(
    method: HttpMethod,
    url: string,
    config: PartialBody<U> & IHttpRequestConfigWithObserveData,
  ): Observable<T>;
  request<T, U = any>(
    method: HttpMethod,
    url: string,
    config: PartialBody<U> & IHttpRequestConfigWithObserveResponse,
  ): Observable<HttpResponse<T>>;
  request<T, U = any>(
    method: HttpMethod,
    url: string,
    options: PartialBody<U> & IHttpRequestConfig,
  ): Observable<HttpResponse<T> | T>;
  request<T, U = any>(
    method: HttpMethod,
    url: string,
    options: PartialBody<U> & IHttpRequestConfig,
  ): Observable<HttpResponse<T> | T> {
    const { observe, body, ...restOfOptions } = options;
    return this.http
      .request({ method, url, data: body, ...restOfOptions })
      .pipe(
        map((response) => (observe === 'data' ? response.data : response)),
        catchError((error: HttpError) =>
          error.code === HttpStatus.BAD_GATEWAY.toString() ||
          error.code === 'Bad Gateway'
            ? throwError(new BadGatewayException())
            : throwError(error),
        ),
      );
  }

  get<T>(url: string, config: IHttpRequestConfigWithObserveData): Observable<T>;
  get<T>(
    url: string,
    config: IHttpRequestConfigWithObserveResponse,
  ): Observable<HttpResponse<T>>;
  get<T>(
    url: string,
    config: IHttpRequestConfig,
  ): Observable<HttpResponse<T> | T>;
  get<T>(
    url: string,
    config: IHttpRequestConfig,
  ): Observable<HttpResponse<T> | T> {
    return this.request<T>('get', url, config);
  }

  post<T, U = any>(
    url: string,
    data: U,
    config: IHttpRequestConfigWithObserveData,
  ): Observable<T>;
  post<T, U = any>(
    url: string,
    data: U,
    config: IHttpRequestConfigWithObserveResponse,
  ): Observable<HttpResponse<T>>;
  post<T, U = any>(
    url: string,
    data: U,
    config: IHttpRequestConfig,
  ): Observable<HttpResponse<T> | T>;
  post<T, U = any>(
    url: string,
    data: U,
    config: IHttpRequestConfig,
  ): Observable<HttpResponse<T> | T> {
    return this.request<T, U>('post', url, { ...config, body: data });
  }
}
