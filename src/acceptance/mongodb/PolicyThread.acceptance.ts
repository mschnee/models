import { expect } from 'chai';
import { ObjectId } from 'mongodb';
import { Documents } from '../../mongodb';
import { ModelManager } from '../../mongodb/ModelManager';
import { withModelManager } from './with-model-manager';

const UIDGenerator = require('uid-generator');

const uidgen = new UIDGenerator(32);

describe('PolicyThread', () => {
  let manager: ModelManager;
  let user1: Documents.User;
  let user2: Documents.User;

  before(async function () {
    [manager] = await withModelManager();
    user1 = new manager.User();
    user2 = new manager.User();
  });

  it('Can create a PolicyThread', async () => {
    const policy = new manager.Policy();
    const PolicyThread = manager.PolicyThread;
    const object = {
      _company: new ObjectId(),
      _policy: policy,
      policyVersion: 1,
      threadId: uidgen.generateSync(),
      comments: [
        {
          commentId: uidgen.generateSync(),
          content: '<p>Some random content for the comment.</p>',
          _createdBy: user1._id,
        },
        {
          commentId: uidgen.generateSync(),
          content: '<p>A reply to the previous comment.</p>',
          _createdBy: user2._id,
        },
      ],
    };

    const result = await PolicyThread.create(object);
    expect(result._policy).to.equal(object._policy);
    expect(result.policyVersion).to.equal(object.policyVersion);
    expect(result.threadId).to.equal(object.threadId);
    expect(Array.isArray(result.comments)).to.be.true;
    expect(result.comments.length).to.equal(object.comments.length);

    // Comments
    for (let i = 0; i < result.comments.length - 1; i++) {
      const actual = result.comments[i];
      const expected = object.comments[i];
      expect(actual.commentId).to.equal(expected.commentId);
      expect(actual.content).to.equal(expected.content);
      expect(actual._createdBy).to.equal(expected._createdBy);
      expect(actual.createdAt).to.be.instanceOf(Date);
    }
  });
});
