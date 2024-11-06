export interface ApiResponse<T = any> {
  success: boolean; // 成功
  data?: T; // 数据
  message: string; // 消息
  statusCode?: number; // 状态码
}
