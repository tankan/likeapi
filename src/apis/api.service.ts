import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  ApiResponse,
  CaiHongPiResult,
  ScenicResult,
  ScenicParams,
  SayLoveResult,
  StarFortuneResult,
  StarFortuneParams,
  TrashClassificationParams,
  TrashClassificationResult,
  GoodNightResult,
  GoodMorningResult,
  HealthTipResult,
  LifeTipResult,
  SolarTermParams,
  SolarTermResult,
  ChineseHerbParams,
  ChineseHerbResult,
  MedicineParams,
  MedicineResult,
  HistoryTodayParams,
  HistoryTodayResult,
  BenCaoGangMuParams,
  BenCaoGangMuResult,
  TenWhyParams,
  TenWhyResult,
} from '../types/api.types';

@Injectable()
export class ApiService extends BaseApiService {
  protected readonly logger = new Logger(ApiService.name);
  private readonly apiBaseUrl = 'https://apis.tianapi.com';

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService);
  }

  getCaiHongPi(): Observable<ApiResponse<CaiHongPiResult>> {
    return this.makeRequest<CaiHongPiResult>(
      `${this.apiBaseUrl}/caihongpi/index`,
    );
  }

  getScenic(params: ScenicParams): Observable<ApiResponse<ScenicResult[]>> {
    return this.makeRequest<ScenicResult[]>(
      `${this.apiBaseUrl}/scenic/index`,
      params,
    );
  }

  getSayLove(): Observable<ApiResponse<SayLoveResult>> {
    return this.makeRequest<SayLoveResult>(`${this.apiBaseUrl}/saylove/index`);
  }

  getStarFortune(
    params: StarFortuneParams,
  ): Observable<ApiResponse<StarFortuneResult>> {
    return this.makeRequest<StarFortuneResult>(
      `${this.apiBaseUrl}/star/index`,
      params,
    );
  }

  getTrashClassification(
    params: TrashClassificationParams,
  ): Observable<ApiResponse<TrashClassificationResult[]>> {
    return this.makeRequest<TrashClassificationResult[]>(
      `${this.apiBaseUrl}/lajifenlei/index`,
      params,
    );
  }

  getGoodNight(): Observable<ApiResponse<GoodNightResult>> {
    return this.makeRequest<GoodNightResult>(`${this.apiBaseUrl}/wanan/index`);
  }

  getGoodMorning(): Observable<ApiResponse<GoodMorningResult>> {
    return this.makeRequest<GoodMorningResult>(
      `${this.apiBaseUrl}/zaoan/index`,
    );
  }

  getHealthTip(): Observable<ApiResponse<HealthTipResult>> {
    return this.makeRequest<HealthTipResult>(
      `${this.apiBaseUrl}/healthtip/index`,
    );
  }

  getLifeTip(): Observable<ApiResponse<LifeTipResult>> {
    return this.makeRequest<LifeTipResult>(`${this.apiBaseUrl}/qiaomen/index`);
  }

  getSolarTerm(
    params: SolarTermParams,
  ): Observable<ApiResponse<SolarTermResult>> {
    return this.makeRequest<SolarTermResult>(
      `${this.apiBaseUrl}/jieqi/index`,
      params,
    );
  }

  getChineseHerb(
    params: ChineseHerbParams,
  ): Observable<ApiResponse<ChineseHerbResult[]>> {
    return this.makeRequest<ChineseHerbResult[]>(
      `${this.apiBaseUrl}/zhongyao/index`,
      params,
    );
  }

  getMedicine(
    params: MedicineParams,
  ): Observable<ApiResponse<MedicineResult[]>> {
    return this.makeRequest<MedicineResult[]>(
      `${this.apiBaseUrl}/yaopin/index`,
      params,
    );
  }

  getHistoryToday(
    params: HistoryTodayParams,
  ): Observable<ApiResponse<HistoryTodayResult[]>> {
    return this.makeRequest<HistoryTodayResult[]>(
      `${this.apiBaseUrl}/lishi/index`,
      params,
    );
  }

  getBenCaoGangMu(
    params: BenCaoGangMuParams,
  ): Observable<ApiResponse<BenCaoGangMuResult[]>> {
    return this.makeRequest<BenCaoGangMuResult[]>(
      `${this.apiBaseUrl}/bcgm/index`,
      params,
    );
  }

  getTenWhy(params: TenWhyParams): Observable<ApiResponse<TenWhyResult[]>> {
    return this.makeRequest<TenWhyResult[]>(
      `${this.apiBaseUrl}/tenwhy/index`,
      params,
    );
  }
}
