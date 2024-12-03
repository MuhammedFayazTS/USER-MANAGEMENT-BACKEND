import moment from "moment"

export const thirtyDaysFromNow = (): Date => moment().add(30, 'days').toDate();