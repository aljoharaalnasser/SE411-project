import { render, screen } from '@testing-library/react'
import About, { team } from '../pages/About.jsx'

test('shows every team member with name and student id', () => {
  render(<About />)

  for (const member of team) {
    expect(screen.getByText(member.name)).toBeInTheDocument()
    expect(screen.getByText(member.studentId)).toBeInTheDocument()
  }
})
