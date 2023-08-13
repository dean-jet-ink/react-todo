export type Credential = {
  email: string
  password: string
}

export type Task = {
  id: number
  title: string
  created_at: Date
  updated_at: Date
}

export type CSRFToken = {
  csrf_token: string
}
