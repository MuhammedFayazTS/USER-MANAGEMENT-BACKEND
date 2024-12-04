import moment from "moment"

export const ONE_DAY_IN_MS = moment.duration(1, "day").asMilliseconds();

export const thirtyDaysFromNow = (): Date => moment().add(30, 'days').toDate();

export const fortyFiveMinutesFromNow = (): Date => moment().add(45, 'minutes').toDate();

export const calculateExpirationDate = (expiresIn: string = "15m"): Date => {
    // Match number + unit (m = minutes, h = hours, d = days)
    const match = expiresIn.match(/^(\d+)([mhd])$/);
    if (!match) throw new Error('Invalid format. Use "15m", "1h", or "2d".');
    const [, value, unit] = match;

    const expirationDate = new Date();
  
    // Check the unit and apply accordingly
    switch (unit) {
        case "m": // minutes
          return moment().add(parseInt(value), "minutes").toDate();
        case "h": // hours
          return moment().add(parseInt(value), "hours").toDate();
        case "d": // days
          return moment().add(parseInt(value), "days").toDate();
        default:
          throw new Error('Invalid unit. Use "m", "h", or "d".');
      }
  };