import { formatDate } from '../formatDate'

const toSeconds = (date: Date) => date.getTime() / 1000

describe('formatDate', () => {
  it('should hide the year for a date of the current year', () => {
    const date = new Date(new Date().getFullYear(), 6, 7)

    expect(formatDate(toSeconds(date))).toBe('7 juillet')
  })

  it('should show the year for a date of another year', () => {
    expect(formatDate(toSeconds(new Date(2021, 6, 7)))).toBe('7 juillet 2021')
  })
})
