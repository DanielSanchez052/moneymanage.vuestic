import _ from 'lodash'
import { TRANSACTION_TYPES, BUDGET_TYPES } from './constants'

export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
  email: (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Please enter a valid email address'
  },
  required: (v: any) => !!v || 'This field is required',
}

export function formatDateToISO(value: string) {
  const date = new Date(value)
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/')
}

export const formatString = function (value: string, listValues: string[]) {
  return value.replace(/{([0-9])}/g, (match, index) =>
    typeof listValues[index] == 'undefined' ? match : listValues[index],
  )
}

export const formatMoney = (value: number) => {
  if (value == undefined) {
    value = 0
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })
}

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export const objectKeysToCamellCase = (obj: string) => {
  return _.mapKeys(obj, (v, k) => _.camelCase(k.toString()))
}

export const getTypeName = (id: number) => {
  let name
  switch (id) {
    case TRANSACTION_TYPES.revenue:
      name = 'Ganado'
      break
    case TRANSACTION_TYPES.spend:
      name = 'Gastado'
      break
    case TRANSACTION_TYPES.movement:
      name = 'Movimiento'
      break
    default:
      name = 'Undefined'
  }
  return name
}

export const getBudgetTypeName = (id: number) => {
  let name
  switch (id) {
    case BUDGET_TYPES.daily:
      name = 'Diario'
      break
    case BUDGET_TYPES.monthly:
      name = 'Mensual'
      break
    case BUDGET_TYPES.yearly:
      name = 'Anual'
      break
    default:
      name = 'Undefined'
  }
  return name
}
