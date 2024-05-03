import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
// import 'dayjs/locale/fr'

dayjs.extend(utc)
dayjs.extend(timezone)

// dayjs.locale('fr')
dayjs.tz.setDefault('Asia/Seoul')

// const timezonedDayjs = (...args: any[]) => {
//   return dayjs(...args).tz()
// }

// const timezonedUnix = (value: number) => {
//   return dayjs.unix(value).tz()
// }

// timezonedDayjs.unix = timezonedUnix
// timezonedDayjs.duration = dayjs.duration

// export default timezonedDayjs
