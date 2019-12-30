const moment = require('moment')
const { setState, isHoliday } = require('holiday-de')
const { getEnv } = require('../../util')

const state = getEnv('CALENDAR_STATE', 'string', null)
if (state) setState(state)

function makeDays(from, span, n) {
  const start = moment(from).utc().startOf(span)

  const days = []
  for (let i = 0; i < n; i++) {
    const date = moment(start).add(i, 'd').toDate()
    const holiday = state && isHoliday(date)
    const day = { date }
    if (holiday) day.holiday = holiday
    days.push(day)
  }

  return days
}

function calendarWeek(parent, { shift }, context) {
  const date = moment().add(shift || 0, 'week')
  return makeDays(date, 'isoWeek', 7)
}

function calendarWorkweek(parent, { shift }, context) {
  const date = moment().add(shift || 0, 'week')
  return makeDays(date, 'isoWeek', 5)
}

module.exports = {
  calendarWeek,
  calendarWorkweek
}
