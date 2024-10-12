export const earningsColor = '#49A8FF'
export const expensesColor = '#154EC1'

export const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export type SourceTotalPerMonth = {
  month: string
  total: SourceTotal[]
}

export type SourceTotal = {
  sourceId: string
  sourceName: string
  earning: number
  expenses: number
}

export const getRevenueFiltered = (month: string, revenues: SourceTotalPerMonth[]): SourceTotalPerMonth => {
  const revenue = revenues.find((revenue) => revenue.month === month)
  return revenue || { month, total: [] }
}
