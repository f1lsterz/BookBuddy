import { exec } from "child_process";
import cron from "node-cron";

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error("One or more required environment variables are missing.");
}

const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = `backup-${timestamp}.sql`;

  const command = `mysqldump -u ${DB_USER} -p${DB_PASSWORD} --host=${DB_HOST} ${DB_NAME} > ${backupFile}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error during backup:", error);
      return;
    }
    console.log(`Database backup saved to ${backupFile}`);
  });
};

cron.schedule("0 0 * * *", backupDatabase);
