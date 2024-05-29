import { TypeProp, DateRange } from '../../data/types'
import { Source } from '../sources/types'

export type TransactionFilters = {
  Type: TypeProp | null
  Source: Source | null
  AccountId: string | null
  TransactionDateRange: DateRange | null
}

export type Transaction = {
  id: string
  accountId: string
  ammount: number
  transactionDate: string
  type: TypeProp
  typeName: string
  source: Source
  sourceName: string
  isActive: boolean
  transactionExtendedProperties: ExtendedProperty[]
}

export type NewTransaction = {
  accountId: string
  ammount: number
  transactionDate: string
  type: number
  sourceId: string
  transactionExtendedProperties: ExtendedProperty[]
}

export type ExtendedProperty = {
  displayName: string
  key: string
  value: string
}
