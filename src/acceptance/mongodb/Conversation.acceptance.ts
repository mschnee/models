import { expect } from 'chai';
import { ModelManager } from '../../mongodb/ModelManager';
import { withModelManager } from './with-model-manager';

describe('Conversation', () => {
  let manager: ModelManager;
  before(async function () {
    [manager] = await withModelManager();
  });

  it('conversation can be instantiated', async () => {
    expect(() => {
      new manager.Conversation();
    }).not.to.throw;
  });

  it('conversation virtual properties work', async () => {
    const intercom_data = {
      conversation_message: 'message test',
      conversation_parts: {
        total_count: 0,
        conversation_parts: [],
      },
      state: null,
      read: false,
    };

    const conversation = new manager.Conversation({
      intercom_data,
      _user: '',
      type: '',
      intercom_conversation_id: '',
    });

    conversation.intercom_data = intercom_data;

    expect(intercom_data.conversation_message).to.equal(conversation.conversation_message);

    expect(intercom_data.conversation_parts.conversation_parts).to.equal(conversation.conversation_parts);

    expect(intercom_data.conversation_parts.total_count).to.equal(conversation.conversation_parts_count);

    expect(intercom_data.state).to.equal(conversation.state);
    expect(intercom_data.read).to.equal(conversation.read);
  });

  it('conversation.addConversationPart adds new part. will ignore if duplicate id', async () => {
    const intercom_data = {
      conversation_message: 'message test',
      conversation_parts: {
        total_count: 0,
        conversation_parts: [],
      },
      state: null,
      read: false,
    };

    const conversation = new manager.Conversation({
      intercom_data,
      _user: '',
      type: '',
      intercom_conversation_id: '',
    });

    const new_part = {
      id: 1,
    };

    conversation.addConversationPart(new_part);

    expect(1).to.equal(conversation.conversation_parts.length);

    conversation.addConversationPart(new_part);

    expect(1).to.equal(conversation.conversation_parts.length);

    const new_part2 = {
      id: 2,
    };

    conversation.addConversationPart(new_part2);

    expect(2).to.equal(conversation.conversation_parts.length);
  });
});
