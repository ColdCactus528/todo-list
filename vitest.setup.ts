import '@testing-library/jest-dom/vitest'
import { beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})

if (!('randomUUID' in crypto)) {
  // @ts-ignore
  crypto.randomUUID = () => Math.random().toString(36).slice(2)
}

// @ts-ignore
window.scrollTo = () => {}