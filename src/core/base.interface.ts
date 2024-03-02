
export interface IResponseDto<T> {
  readonly msg?: String;
  readonly data?: Array<T> | T;
  readonly meta?: IMeta;
}
  
export interface IMeta {
  pagination?: IPaginationResponse;
}
  
export interface IPaginationResponse {
  page?: number;
  pageSize?: number;
  pageCount?: number;
  total?: number;
}