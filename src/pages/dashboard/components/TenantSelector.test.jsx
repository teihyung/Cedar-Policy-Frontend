import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TenantSelector from './TenantSelector'

const tenants = [
  { id: '1', name: 'Acme Production', slug: 'acme-prod' },
  { id: '2', name: 'Acme Staging', slug: 'acme-staging' },
]

describe('TenantSelector', () => {
  it('renders an option for each tenant', () => {
    render(<TenantSelector tenants={tenants} selectedTenantId="1" onChange={() => {}} />)
    expect(screen.getByText('Acme Production')).toBeInTheDocument()
    expect(screen.getByText('Acme Staging')).toBeInTheDocument()
  })

  it('calls onChange with the selected tenant id', async () => {
    const onChange = vi.fn()
    render(<TenantSelector tenants={tenants} selectedTenantId="1" onChange={onChange} />)
    await userEvent.selectOptions(screen.getByRole('combobox'), '2')
    expect(onChange).toHaveBeenCalledWith('2')
  })
})