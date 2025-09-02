export type TodoId = string

export type Todo = {
  id: TodoId
  title: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

export type Filter = 'all' | 'active' | 'completed'
