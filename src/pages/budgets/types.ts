import { TypeProp } from '../../data/types'
import { Source } from '../sources/types'

export type BudgetFilters = {
  Type: TypeProp | null
  Source: Source | null
  AccountId: string | null
}

export type Budget = {
  id: string
  accountId: string
  targetAmmount: number
  budgetType: TypeProp
  targetType: TypeProp
  targetSource: Source
  budgetTypeName: string
  targetSourceName: string
  targetTypeName: string
  createDate: string
  isActive: boolean
  budgetHistory: BudgetHistory[]
}

export type NewBudget = {
  accountId: string
  targetAmmount: number
  budgetType: TypeProp
  targetType: TypeProp
  source: Source
  startDate: string
}

export type BudgetHistory = {
  id: string
  budgetSettingsId: string
  targetAmmount: number
  currentAmmount: number
  budgetType: TypeProp
  targetType: TypeProp
  targetSource: Source
  budgetTypeName: string
  targetSourceName: string
  targetTypeName: string
  startDate: string
  endDate: string
  isActive: boolean
  createDate: string
}
