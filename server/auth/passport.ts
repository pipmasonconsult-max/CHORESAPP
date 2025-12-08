import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';

export function configurePassport() {
  // Serialize user ID to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const db = await getDb();
      if (!db) {
        return done(new Error('Database not available'));
      }

      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      const user = result[0];

      if (!user) {
        return done(new Error('User not found'));
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const db = await getDb();
          if (!db) {
            return done(new Error('Database not available'));
          }

          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const profilePicture = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error('No email provided by Google'));
          }

          // Check if user exists by Google ID
          let result = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
          let user = result[0];

          if (user) {
            // Update existing user
            await db.update(users)
              .set({
                name,
                profilePicture,
                lastSignedIn: new Date(),
              })
              .where(eq(users.id, user.id));

            // Fetch updated user
            result = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
            user = result[0];
          } else {
            // Check if user exists by email (for migration from old auth)
            result = await db.select().from(users).where(eq(users.email, email)).limit(1);
            user = result[0];

            if (user) {
              // Link Google account to existing user
              await db.update(users)
                .set({
                  googleId,
                  name,
                  profilePicture,
                  lastSignedIn: new Date(),
                })
                .where(eq(users.id, user.id));

              // Fetch updated user
              result = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
              user = result[0];
            } else {
              // Create new user
              const insertResult = await db.insert(users).values({
                googleId,
                email,
                name,
                profilePicture,
                role: 'user',
                lastSignedIn: new Date(),
              });

              const newUserId = Number((insertResult as any).insertId || (insertResult as any)[0]?.insertId);

              // Fetch the newly created user
              result = await db.select().from(users).where(eq(users.id, newUserId)).limit(1);
              user = result[0];
            }
          }

          return done(null, user);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error as Error);
        }
      }
    )
  );
}

export default passport;
