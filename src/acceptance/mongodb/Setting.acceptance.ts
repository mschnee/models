import { expect } from 'chai';
import { ModelManager } from '../../mongodb/ModelManager';
import { withModelManager } from './with-model-manager';

describe('Configuration', () => {
  let manager: ModelManager;

  before(async function () {
    [manager] = await withModelManager();
  });

  it('can be instantiated', async () => {
    expect(() => {
      new manager.DefaultAdvisorConfiguration();
    }).not.to.throw;
  });

  it('name is required', async () => {
    const setting = new manager.Configuration();
    const error = setting.validateSync();

    expect(error.errors['name'].message).to.equal('Path `name` is required.');

    setting.name = 'X';

    expect(setting.validateSync()).to.be.undefined;
    expect('X').to.equal(setting.name);
  });

  it('can create advisor', async () => {
    const setting = new manager.Configuration({ name: 'WTF' });
    const advisor = new manager.DefaultAdvisorConfiguration({
      name: 'defaultAdvisor',
      _advisor: setting._id,
    });
    expect(setting._id).to.equal(advisor._advisor);
    expect(advisor.validateSync()).to.be.undefined;
    expect('defaultAdvisor').to.equal(advisor.name);
    expect('WTF').to.equal(setting.name);
  });

  it('default config', async () => {
    const todo = new manager.DefaultTodosConfiguration({
      name: 'DefaultTodos',
      todos: [
        {
          daysDue: 2,
          todo: {
            title: 'Account Setup',
            status: 'requested',
            type: 'core',
          },
        },
        {
          daysDue: 3,
          todo: {
            title: 'Intro Period',
            status: 'requested',
            type: 'core',
          },
        },
      ],
    });

    expect('DefaultTodos').to.equal(todo.name);
    expect('core').to.equal(todo.todos[0].todo.type);
    expect(2).to.equal(todo.todos.length);
  });
});
