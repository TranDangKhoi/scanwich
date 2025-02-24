import { Cron } from "croner";
import prisma from "src/database";

// Cron pattern for every hour

const autoRemoveRefreshTokenJob = () => {
  Cron("@hourly", async () => {
    try {
      await prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
};

export default autoRemoveRefreshTokenJob;
