import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'
import type { ChartData } from 'chart.js'
import { Source } from '../pages/sources/types'

export type ColorThemes = {
  [key: string]: string
}

export type TLineChartData = ChartData<'line', any, any>
export type TBarChartData = ChartData<'bar', any, any>
export type TBubbleChartData = ChartData<'bubble', any, any>
export type TDoughnutChartData = ChartData<'doughnut', any, any>
export type TPieChartData = ChartData<'pie', any, any>

export type TChartData = TLineChartData | TBarChartData | TBubbleChartData | TDoughnutChartData | TPieChartData

export type Pagination = {
  PageIndex: number
  PageSize: number
}

export type TypeProp = {
  id: number
  name: string
  nameT: string | undefined
}

export type AuthenticationParams = {
  accountId: string
  token: string
}

export type ApiResponse = {
  data: any
  success: boolean
  errors: Array<ApiError>
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: any
  status: number
}

export type ApiError = {
  code: string
  message: string
}

export type PaginatedResult<ResultType> = {
  page: number
  pageSize: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  items: ResultType[]
}

export type ErrorType = {
  code: string
  message: string
}

export enum TransactionType {
  movement = 1,
  spend = 2,
  revenue = 3,
}

export type Settings = {
  theme: string
  lang: string
  loanSource?: Source
}

export type DateRange = {
  start: string
  end: string
}
