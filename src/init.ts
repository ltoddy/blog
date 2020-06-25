import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } from "./config";
import { User } from "./models/User";
import { loggerFactory } from "./utils/logger";

const logger = loggerFactory("init.ts");

// 项目启动，初始化项目要做的事情
export async function initialize() {
  logger.info("start initialize server");
  await createAdministrator();
  logger.info("finish initialize server");
}

// 注册管理员
async function createAdministrator() {
  const user = await User.queryByUsername(ADMIN_USERNAME);
  if (!user) {
    logger.info(`start create administrator account, username: ${ADMIN_USERNAME}, email: ${ADMIN_EMAIL}`);
    await User.new(ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD);
  }
}
