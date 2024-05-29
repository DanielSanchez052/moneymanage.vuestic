export type Login = {
  email: string
  password: string
}

export type NewUser = {
  email: string
  username: string
  phone: string
  password: string
  repeatPassword: string
}

export type RecoverPasswordRequest = {
  email: string
}

export type RecoverPassword = {
  email: string
  password: string
  repeatPassword: string
  resetPasswordToken?: string
}

export type User = {
  token: string
  accountId: string
}

export type Account = {
  id: string
  status: string
  ammountBalance: number
}
