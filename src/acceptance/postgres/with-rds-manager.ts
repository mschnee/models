import { RdsManager, RdsManagerSslStatus } from '../../postgres';

let manager: RdsManager;

export async function withRdsManager(): Promise<[RdsManager, Function]> {
  if (!manager) {
    manager = new RdsManager();

    manager.setup({
      rdsUrl: process.env.TEST_RDS_URL,
      rdsReadonlyUrl: process.env.TEST_RDS_URL,
      ssl: RdsManagerSslStatus.Disabled,
    });
    await manager.start();
  }

  return [
    manager,
    async () => {
      await manager.stop();
    },
  ];
}
