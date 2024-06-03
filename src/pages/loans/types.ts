import { TypeProp } from '../../data/types'

export type LoanFilters = {
  AccountId: string | null
  isPaid: boolean | null
  Frecuency: TypeProp | null
  Lend: string | null
  Borrow: string | null
}

export type Loan = {
  loanId: string
  lend: string
  borrow: string
  ammountBorrowed: number
  percentage: number
  paymentFrecuency: TypeProp
  paymentFrecuencyName: string
  paid: boolean
  loanTransactionHistory: LoanTransactionHistory[]
}

export type NewLoan = {
  lend: string
  borrow: string
  ammountBorrowed: number
  percentage: number
  paymentFrecuency: TypeProp
  periodCount: number
  accountId: string
}

export type LoanTransactionHistory = {
  id: string
  paymentDate: string
  transactionId: string | null
  transactionCompleted: boolean
  transactionType: TypeProp
  transactionTypeName: string
  ammountToPay: number
  ammoundPaid: number
  generated: boolean
}

export type PaidLoan = {
  transactionId: string
  loanId: string
  loanHistoryId: string
  ammount: number
}
