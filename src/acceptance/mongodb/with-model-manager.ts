import * as mongoose from 'mongoose';
import { ModelManager } from '../../mongodb/ModelManager';
mongoose.set('bufferCommands', false);
let manager: ModelManager;

export async function withModelManager(): Promise<[ModelManager, Function]> {
  if (!manager) {
    manager = new ModelManager();

    await manager.setup(process.env.TEST_MONGO_URL);
  }

  return [
    manager,
    async () => {
      await manager.close();
    },
  ];
}
