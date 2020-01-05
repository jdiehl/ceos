const { gql } = require('apollo-server')

module.exports = gql`

type CalendarDay {
  date: Date!
  holiday: String
}

extend type Query {
  calendarMonth(shift: Int): [CalendarDay]
  calendarWeek(shift: Int): [CalendarDay]
  calendarWorkweek(shift: Int): [CalendarDay]
}
`
