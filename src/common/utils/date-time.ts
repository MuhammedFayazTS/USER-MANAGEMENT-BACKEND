import moment from "moment"

export const thirtyDaysFromNow = (): Date => moment().add(30, 'days').toDate();

export const fortyFiveMinutesFromNow = (): Date => moment().add(45, 'minutes').toDate();