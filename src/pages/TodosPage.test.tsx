import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { App } from './TodosPage'
import '@testing-library/jest-dom/vitest'


vi.mock('../shared/components/SnackbarUndo', () => ({
  SnackbarUndo: () => null
}))
vi.mock('../shared/hooks/useUndoDelete', () => ({
  useUndoDelete: () => ({
    visible: false,
    removeWithUndo: vi.fn((id: string) => {}),
    undo: vi.fn()
  })
}))
vi.mock('../shared/hooks/useBarVisible', () => ({
  useBarVisible: () => ({ sentryRef: { current: null }, isVisible: true })
}))

beforeEach(() => {
  localStorage.clear()
})

describe('TodosPage', () => {
  it('add → toggle → filter → clear completed', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText(/what needs to be done/i)
    await user.type(input, 'first{enter}')
    await user.type(input, 'second{enter}')
    expect(screen.getByText('2 items left')).toBeInTheDocument()

    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    expect(screen.getByText('1 items left')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^completed$/i }))
    expect(screen.getByText(/second/i)).toBeInTheDocument()
    expect(screen.queryByText(/first/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear completed/i }))
    await user.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.queryByText(/second/i)).not.toBeInTheDocument()
    expect(screen.getByText(/first/i)).toBeInTheDocument()
    expect(screen.getByText('1 items left')).toBeInTheDocument()
  })

  it('edit on dblclick saves on Enter and cancels on Esc', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText(/what needs to be done/i)
    await user.type(input, 'task{enter}')
    const item = screen.getByText('task')

    await user.dblClick(item)

    const edit = screen.getByDisplayValue('task')
    await user.clear(edit)
    await user.type(edit, 'renamed{enter}')
    expect(screen.getByText('renamed')).toBeInTheDocument()

    await user.dblClick(screen.getByText('renamed'))
    const edit2 = screen.getByDisplayValue('renamed')
    await user.type(edit2, ' !!!{Escape}')
    expect(screen.getByText('renamed')).toBeInTheDocument()
  })

  it('toggle all button works', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText(/what needs to be done/i)
    await user.type(input, 'a{enter}')
    await user.type(input, 'b{enter}')
    await user.click(screen.getByRole('button', { name: /mark all as completed/i }))
    expect(screen.getByText('0 items left')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /unmark all/i }))
    expect(screen.getByText('2 items left')).toBeInTheDocument()
  })
})
