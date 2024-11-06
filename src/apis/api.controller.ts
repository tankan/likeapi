import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  ScenicParams,
  ScenicResult,
  CaiHongPiResult,
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
  ApiResponse,
  ApiResponseDto,
} from '../types/api.types';
import { Cache } from '../common/decorators/cache.decorator';
import { CacheGuard } from '../common/guards/cache.guard';
import { BaseController } from '../common/base.controller';

@ApiTags('APIs')
@Controller('apis')
export class ApiController extends BaseController {
  constructor(private readonly apiService: ApiService) {
    super();
  }

  @Get('caihongpi')
  @ApiOperation({ summary: 'Get Cai Hong Pi' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: ApiResponseDto,
  })
  getCaiHongPi(): Observable<ApiResponse<{ content: string }>> {
    return this.apiService.getCaiHongPi().pipe(
      map((response) =>
        this.handleSuccess({
          content: (response.result as CaiHongPiResult).content,
        }),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<{ content: string }>>;
  }

  @Get('scenic')
  @ApiOperation({ summary: 'Get Scenic Information' })
  @ApiQuery({ name: 'word', required: true, type: String })
  @ApiQuery({ name: 'num', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: [ScenicResult],
  })
  @UseGuards(CacheGuard)
  @Cache(3600)
  getScenic(
    @Query() params: ScenicParams,
  ): Observable<ApiResponse<{ scenicInfo: ScenicResult[] }>> {
    return this.apiService.getScenic(params).pipe(
      map((response) =>
        this.handleSuccess({ scenicInfo: response.result as ScenicResult[] }),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<{ scenicInfo: ScenicResult[] }>>;
  }

  @Get('sayLove')
  @ApiOperation({ summary: 'Get Say Love' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: ApiResponseDto,
  })
  getSayLove(): Observable<ApiResponse<{ content: string }>> {
    return this.apiService.getSayLove().pipe(
      map((response) =>
        this.handleSuccess({
          content: (response.result as SayLoveResult).content,
        }),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<{ content: string }>>;
  }

  @Get('starFortune')
  @ApiOperation({ summary: 'Get Star Fortune' })
  @ApiQuery({ name: 'word', required: true, type: String })
  @ApiQuery({ name: 'num', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: StarFortuneResult,
  })
  @UseGuards(CacheGuard)
  @Cache(60)
  getStarFortune(
    @Query() params: StarFortuneParams,
  ): Observable<ApiResponse<StarFortuneResult>> {
    return this.apiService.getStarFortune(params).pipe(
      map((response) =>
        this.handleSuccess(response.result as StarFortuneResult),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<StarFortuneResult>>;
  }

  @Get('trashClassification')
  @ApiOperation({ summary: 'Get Trash Classification' })
  @ApiQuery({ name: 'word', required: true, type: String })
  @ApiQuery({ name: 'num', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: [TrashClassificationResult],
  })
  @UseGuards(CacheGuard)
  @Cache(3600)
  getTrashClassification(
    @Query() params: TrashClassificationParams,
  ): Observable<ApiResponse<TrashClassificationResult[]>> {
    return this.apiService.getTrashClassification(params).pipe(
      map((response) =>
        this.handleSuccess(response.result as TrashClassificationResult[]),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<TrashClassificationResult[]>>;
  }

  @Get('goodNight')
  @ApiOperation({ summary: 'Get Good Night' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: GoodNightResult,
  })
  @UseGuards(CacheGuard)
  @Cache(3600) // 缓存一小时，因为内容每天可能会变化
  getGoodNight(): Observable<ApiResponse<{ content: string }>> {
    return this.apiService.getGoodNight().pipe(
      map((response) =>
        this.handleSuccess({
          content: (response.result as GoodNightResult).content,
        }),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<{ content: string }>>;
  }

  @Get('goodMorning')
  @ApiOperation({ summary: 'Get Good Morning' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: GoodMorningResult,
  })
  @UseGuards(CacheGuard)
  @Cache(3600) // 缓存一小时，因为内容每天可能会变化
  getGoodMorning(): Observable<ApiResponse<{ content: string }>> {
    return this.apiService.getGoodMorning().pipe(
      map((response) =>
        this.handleSuccess({
          content: (response.result as GoodMorningResult).content,
        }),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<{ content: string }>>;
  }

  @Get('healthTip')
  @ApiOperation({ summary: 'Get Health Tip' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: HealthTipResult,
  })
  @UseGuards(CacheGuard)
  @Cache(3600) // 缓存一小时，因为健康小提示可能不会频繁更新
  getHealthTip(): Observable<ApiResponse<{ content: string }>> {
    return this.apiService.getHealthTip().pipe(
      map((response) =>
        this.handleSuccess({
          content: (response.result as HealthTipResult).content,
        }),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<{ content: string }>>;
  }

  @Get('lifeTip')
  @ApiOperation({ summary: 'Get Life Tip' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: LifeTipResult,
  })
  @UseGuards(CacheGuard)
  @Cache(3600) // 缓存一小时，因为生活小窍门可能不会频繁更新
  getLifeTip(): Observable<ApiResponse<{ content: string }>> {
    return this.apiService.getLifeTip().pipe(
      map((response) =>
        this.handleSuccess({
          content: (response.result as LifeTipResult).content,
        }),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<{ content: string }>>;
  }

  @Get('solarTerm')
  @ApiOperation({ summary: 'Get Solar Term' })
  @ApiQuery({ name: 'word', required: true, type: String })
  @ApiQuery({ name: 'num', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: SolarTermResult,
  })
  @UseGuards(CacheGuard)
  @Cache(3600 * 24) // 缓存一天，因为节气信息不会频繁变化
  getSolarTerm(
    @Query() params: SolarTermParams,
  ): Observable<ApiResponse<SolarTermResult>> {
    return this.apiService.getSolarTerm(params).pipe(
      map((response) => this.handleSuccess(response.result as SolarTermResult)),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<SolarTermResult>>;
  }

  @Get('chineseHerb')
  @ApiOperation({ summary: 'Get Chinese Herb' })
  @ApiQuery({ name: 'word', required: true, type: String })
  @ApiQuery({ name: 'num', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: [ChineseHerbResult],
  })
  @UseGuards(CacheGuard)
  @Cache(3600 * 24) // 缓存一天，因为中草药信息不会频繁变化
  getChineseHerb(
    @Query() params: ChineseHerbParams,
  ): Observable<ApiResponse<ChineseHerbResult[]>> {
    return this.apiService.getChineseHerb(params).pipe(
      map((response) =>
        this.handleSuccess(response.result as ChineseHerbResult[]),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<ChineseHerbResult[]>>;
  }

  @Get('medicine')
  @ApiOperation({ summary: 'Get Medicine' })
  @ApiQuery({ name: 'word', required: true, type: String })
  @ApiQuery({ name: 'num', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: [MedicineResult],
  })
  @UseGuards(CacheGuard)
  @Cache(3600 * 24) // 缓存一天，因为药品信息不会频繁变化
  getMedicine(
    @Query() params: MedicineParams,
  ): Observable<ApiResponse<MedicineResult[]>> {
    return this.apiService.getMedicine(params).pipe(
      map((response) =>
        this.handleSuccess(response.result as MedicineResult[]),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<MedicineResult[]>>;
  }

  @Get('historyToday')
  @ApiOperation({ summary: 'Get History Today' })
  @ApiQuery({ name: 'word', required: true, type: String })
  @ApiQuery({ name: 'num', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: [HistoryTodayResult],
  })
  @UseGuards(CacheGuard)
  @Cache(3600 * 24) // 缓存一天，因为历史事件不会变化
  getHistoryToday(
    @Query() params: HistoryTodayParams,
  ): Observable<ApiResponse<HistoryTodayResult[]>> {
    return this.apiService.getHistoryToday(params).pipe(
      map((response) =>
        this.handleSuccess(response.result as HistoryTodayResult[]),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<HistoryTodayResult[]>>;
  }

  @Get('benCaoGangMu')
  @ApiOperation({ summary: 'Get Ben Cao Gang Mu' })
  @ApiQuery({ name: 'word', required: true, type: String })
  @ApiQuery({ name: 'num', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: [BenCaoGangMuResult],
  })
  @UseGuards(CacheGuard)
  @Cache(3600 * 24) // 缓存一天，因为本草纲目信息不会频繁变化
  getBenCaoGangMu(
    @Query() params: BenCaoGangMuParams,
  ): Observable<ApiResponse<BenCaoGangMuResult[]>> {
    return this.apiService.getBenCaoGangMu(params).pipe(
      map((response) =>
        this.handleSuccess(response.result as BenCaoGangMuResult[]),
      ),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<BenCaoGangMuResult[]>>;
  }

  @Get('tenWhy')
  @ApiOperation({ summary: 'Get Ten Why' })
  @ApiQuery({ name: 'word', required: true, type: String })
  @ApiQuery({ name: 'num', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @SwaggerApiResponse({
    status: 200,
    description: 'Success',
    type: [TenWhyResult],
  })
  @UseGuards(CacheGuard)
  @Cache(3600) // 缓存一小时，因为内容可能会更新
  getTenWhy(
    @Query() params: TenWhyParams,
  ): Observable<ApiResponse<TenWhyResult[]>> {
    return this.apiService.getTenWhy(params).pipe(
      map((response) => this.handleSuccess(response.result as TenWhyResult[])),
      catchError((error) => this.handleError(error)),
    ) as Observable<ApiResponse<TenWhyResult[]>>;
  }
}
