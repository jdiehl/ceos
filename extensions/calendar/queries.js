const moment = require('moment')
const { setState, isHoliday } = require('holiday-de')
const { getEnv } = require('../../util')

const state = getEnv('CALENDAR_STATE', 'string', null)
if (state) setState(state)

function makeDays(from, to) {
  const days = []
  for (let date = moment(from); date < to; date = date.add(1, 'day')) {
    const holiday = state && isHoliday(date)
    const day = { date: date.toDate() }
    if (holiday) day.holiday = holiday
    days.push(day)
  }
  return days
}

function calendarMonth(parent, { shift }, context) {
  const from = moment().utc().startOf('month').add(shift || 0, 'month')
  const to = moment(from).add(1, 'month')
  return makeDays(from, to)
}

function calendarWeek(parent, { shift }, context) {
  const from = moment().utc().startOf('isoweek').add(shift || 0, 'week')
  const to = moment(from).add(1, 'week')
  return makeDays(from, to)
}

function calendarWorkweek(parent, { shift }, context) {
  const from = moment().utc().startOf('isoweek').add(shift || 0, 'week')
  const day = from.day()
  if (day < 1 || day > 5) from.add(1, 'week')
  const to = moment(from).add(5, 'day')
  return makeDays(from, to)
}

module.exports = {
  calendarMonth,
  calendarWeek,
  calendarWorkweek
}
