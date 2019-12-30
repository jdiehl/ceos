const { gql } = require('apollo-server')

module.exports = gql`

type CalendarDay {
  date: Date!
  holiday: String
}

extend type Query {
  calendarWeek(shift: Int): [CalendarDay]
  calendarWorkweek(shift: Int): [CalendarDay]
}
`
