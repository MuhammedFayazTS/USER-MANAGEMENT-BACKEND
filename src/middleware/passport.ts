import passport from "passport";
import { setupJwtStrategy } from "../common/strategies/jwt.strategy";
import { setupGoogleStrategy } from "../common/strategies/google.strategy";

// const initializePassport = () => {
//   setupJwtStrategy(passport);
//   setupGoogleStrategy(passport);
// };

// initializePassport();

export const initializePassport = () => {
  setupJwtStrategy(passport);
  setupGoogleStrategy(passport);
  return passport.initialize(); // Ensures Passport is ready to use in middleware
};
