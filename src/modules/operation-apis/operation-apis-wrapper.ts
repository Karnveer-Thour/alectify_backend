import { InjectConfig } from '@common/decorators/inject-config.decorator';
import { HttpWrapper } from '@common/http-wrapper/http-wrapper';
import {
  LLMAPIsConfig,
  LLMAPIsConfigType,
} from '@core/llm-apis/llm-apis.config';
import {
  OperationAPIsConfig,
  OperationAPIsConfigType,
} from '@core/operation-apis/operation-apis.config';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { DjangoAPIResponseDTO } from './dto/django-api-response.dto';
import { LLMAPIResponseDTO } from './dto/llm-api-response.dto';

@Injectable({})
export class OperationApisWrapper {
  constructor(
    @InjectConfig(OperationAPIsConfig)
    private readonly operationAPIsConfigFactory: OperationAPIsConfigType,
    @InjectConfig(LLMAPIsConfig)
    private readonly llmAPIsConfigFactory: LLMAPIsConfigType,
    private readonly http: HttpWrapper,
  ) {}

  getTeamMembersOfArea(token, data) {
    const endPoint = `/projects/${data.subProjectId}/packages/${data.areaId}/team-members/`;
    return this.djangoGetCall(endPoint, token);
  }

  getTeamMembersOfAsset(token, data) {
    const endPoint = `/projects/${data.subProjectId}/tags/${data.assetId}/team-members/`;
    return this.djangoGetCall(endPoint, token);
  }

  getTeamMembersOfSubProject(token, data) {
    const endPoint = `/projects/new/${data.subProjectId}/?type=users`;
    return this.djangoGetCall(endPoint, token);
  }

  getOrganizations(token) {
    const endPoint = `/organizations/`;
    return this.djangoGetCall(endPoint, token);
  }

  getOrganizationTypes(token) {
    const endPoint = `/organization-types/`;
    return this.djangoGetCall(endPoint, token);
  }

  createOrganizations(token, body) {
    const endPoint = `/organizations/`;
    return this.djangoPostCall(endPoint, token, body);
  }

  getMainProjects(token) {
    const endPoint = `/masterprojects/`;
    return this.djangoGetCall(endPoint, token);
  }

  ingest(token, body) {
    const endPoint = `/rag-ingest`;
    return this.llmPostCall(endPoint, token, body);
  }

  private djangoGetCall<Request = any, Response = any>(
    endPoint: string,
    token: string,
  ): Promise<Response> {
    const url =
      this.operationAPIsConfigFactory.djangoOperationUrl.concat(endPoint);
    const headers = OperationApisWrapper.getHeaders(token);
    return this.http
      .get<DjangoAPIResponseDTO<Response>>(url, {
        headers,
      })
      .pipe(
        map((response) => {
          if (response.status) {
            return response.data as Response;
          }
          throw response;
        }),
      )
      .toPromise();
  }

  private djangoPostCall<Request = any, Response = any>(
    endPoint: string,
    token: string,
    data: any,
  ): Promise<Response> {
    const url =
      this.operationAPIsConfigFactory.djangoOperationUrl.concat(endPoint);
    const headers = OperationApisWrapper.getHeaders(token);
    return this.http
      .post<DjangoAPIResponseDTO<Response>>(url, data, {
        headers,
      })
      .pipe(
        map((response) => {
          if (response.status) {
            return response.data as Response;
          }
          throw response;
        }),
      )
      .toPromise();
  }

  private llmPostCall<Request = any, Response = any>(
    endPoint: string,
    token: string,
    data: any,
  ): Promise<Response> {
    const url = this.llmAPIsConfigFactory.llmUrl.concat(endPoint);
    const headers = OperationApisWrapper.getHeaders(token);
    return this.http
      .post<LLMAPIResponseDTO<Response>>(url, data, {
        headers,
      })
      .pipe(
        map((response) => {
          if (response.status) {
            console.log(
              'llmPostCall response status: %d  response data : %s',
              response.status,
              response.data,
            );
            return response.data as Response;
          }
          throw response;
        }),
      )
      .toPromise();
  }

  private static getHeaders(token: string): Record<'Authorization', string> {
    return { Authorization: token };
  }
}
