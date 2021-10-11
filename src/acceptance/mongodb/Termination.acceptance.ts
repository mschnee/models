import { expect } from 'chai';
import { ModelManager } from '../../mongodb/ModelManager';
import { withModelManager } from './with-model-manager';

describe('Termination', () => {
  let manager: ModelManager;
  before(async function () {
    [manager] = await withModelManager();
  });

  describe('when instantiated', () => {
    it('it succeeds', async () => {
      expect(() => {
        new manager.Termination();
      }).not.to.throw;
    });
  });

  describe('.setActiveStep', () => {
    let termination;

    before(async function () {
      termination = new manager.Termination({
        employee: '123',
        user: '345',
        termination_date: '2022-08-08T07:00:00.000Z',
        final_pay: '1000',
      });

      await termination.generateSteps();
    });

    describe('when the step name provided is not a valid termination step', () => {
      let previousStep;

      before(() => {
        previousStep = termination.steps.find((step) => step.active);

        termination.setActiveStep('someName', '678');
      });

      it('it should keep the previous step active', () => {
        expect(termination.getActiveStep()).to.eql(previousStep.name);
      });
    });

    describe('when the step name provided is a valid step', () => {
      const activeStepName = 'print';
      let user;
      let completedByID;

      let previousStep;
      let currentStep;

      before(() => {
        user = new manager.User();
        completedByID = user.id;
        previousStep = termination.steps.find((step) => step.active);

        termination.setActiveStep(activeStepName, completedByID);

        currentStep = termination.steps.find((step) => step.active);
      });

      it('it sets `active` to `true`', () => {
        expect(currentStep.active).to.be.true;
      });

      it('it sets `complete` to `false`', () => {
        expect(currentStep.complete).to.be.false;
      });

      it('it sets `complete` on the the preceding step to `true`', () => {
        expect(previousStep.complete).to.be.true;
      });

      it('it sets `_completeBy` on the the preceding step to the provided user ID', () => {
        expect(previousStep._completedBy.toString()).to.equal(completedByID);
      });
    });
  });
});
