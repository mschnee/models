import { Context, inject, Injection, ResolutionSession } from '@loopback/core';
import debugFactory from 'debug';
import { RdbBindings } from './keys';
const debug = debugFactory('bambee:models:RdsComponent:decorator');

function repository<T extends Function>(
  entity?: T,
): (
  target: Object,
  member: string | undefined,
  methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined,
) => void {
  return inject(
    '',
    { decorator: '@repository' },
    async (ctx: Context, injection: Readonly<Injection>, session: ResolutionSession) => {
      const conn = await getConnection(ctx, 'default');
      if (!entity) {
        return conn;
      } else {
        debug(`Injecting ${entity.name} from @repository`);
        return conn.getRepository<T>(entity);
      }
    },
  );
}

function readonlyRepository<T extends Function>(
  entity?: T,
): (
  target: Object,
  member: string | undefined,
  methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined,
) => void {
  return inject(
    '',
    { decorator: '@readonlyRepository' },
    async (ctx: Context, injection: Readonly<Injection>, session: ResolutionSession) => {
      const conn = await getConnection(ctx, 'default');
      if (!entity) {
        return conn;
      } else {
        debug(`Injecting ${entity.name} from @readonlyRepository`);
        return conn.getRepository<T>(entity);
      }
    },
  );
}

async function getConnection(ctx: Context, connectionName?: string) {
  debug.extend(':getConnection')(`Getting named connection: ${connectionName}`);
  const manager = await ctx.get(RdbBindings.MANAGER);
  return manager.get(connectionName);
}

export { repository, readonlyRepository };
