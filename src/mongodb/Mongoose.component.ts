/**
 * This file was automatically generated at 2021-10-05T01:42:45.120Z.
 * It should not be committed to git, and you shouldn't make any changes to it.
 */
import { ApiServerBindings } from '@bambeehr/api-core';
import * as Schemas from './types/schemas';
import type * as winston from 'winston';
import {
  Application,
  bind,
  Binding,
  BindingScope,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
} from '@loopback/core';
import { getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import debugFactory from 'debug';
import { Connection, ConnectOptions, createConnection } from 'mongoose';
import { Bindings } from './types';
import { MongooseComponentLifecycleObserver } from './Mongoose.component.lifecycle-observer';

const debug = debugFactory('bambee:models:MongooseComponent');

export interface MongooseComponentConfig {
  uri: string;
  options?: ConnectOptions;
}

@bind({
  tags: { [ContextTags.KEY]: Bindings.COMPONENT },
  scope: BindingScope.SINGLETON,
})
export class MongooseComponent implements Component {
  lifeCycleObservers = [MongooseComponentLifecycleObserver];
  mongooseConnection: Connection;
  bindings: Binding[] = [];
  private started = false;

  constructor(
    @config()
    readonly configuration: MongooseComponentConfig,
    @inject(CoreBindings.APPLICATION_INSTANCE)
    readonly app: Application,
    @inject(ApiServerBindings.Services.Logger) protected logger: winston.Logger,
  ) {
    debug('MongooseComponent:constructed()');
  }

  async getDbStats(): Promise<any> {
    return this.mongooseConnection.db.stats();
  }

  async stop() {
    if (!this.started) {
      return;
    }
    this.started = false;
    debug('MongooseComponent:stop()');
    await this.mongooseConnection.close();
  }

  async start() {
    if (this.started) {
      return;
    }
    this.started = true;
    debug('MongooseComponent:start()');
    this.mongooseConnection = createConnection(this.configuration.uri, this.configuration.options);
    this.mongooseConnection.on('error', (err) => {
      this.logger.error('[MongooseComponent] Error', err);
    });
    /* Typegoose Schemas */
    this.app
      .bind(Bindings.Auth)
      .to(
        getModelForClass(Schemas.Auth, { options: { customName: 'Auth' }, existingConnection: this.mongooseConnection }),
      );

    this.app
      .bind(Bindings.CompanyAdvisor)
      .to(
        getModelForClass(Schemas.CompanyAdvisor, {
          options: { customName: 'CompanyAdvisor' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.CompanyAdvisorAssignmentHistory)
      .to(
        getModelForClass(Schemas.CompanyAdvisorAssignmentHistory, {
          options: { customName: 'CompanyAdvisorAssignmentHistory' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.CompanyInsurancePlan)
      .to(
        getModelForClass(Schemas.CompanyInsurancePlan, {
          options: { customName: 'CompanyInsurancePlan' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.CompanyMilestone)
      .to(
        getModelForClass(Schemas.CompanyMilestone, {
          options: { customName: 'CompanyMilestone' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.CompanyScore)
      .to(
        getModelForClass(Schemas.CompanyScore, {
          options: { customName: 'CompanyScore' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.DocumentTemplate)
      .to(
        getModelForClass(Schemas.DocumentTemplate, {
          options: { customName: 'DocumentTemplate' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.InsuranceCarrier)
      .to(
        getModelForClass(Schemas.InsuranceCarrier, {
          options: { customName: 'InsuranceCarrier' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.LeadForm)
      .to(
        getModelForClass(Schemas.LeadForm, {
          options: { customName: 'LeadForm' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.Locale)
      .to(
        getModelForClass(Schemas.Locale, {
          options: { customName: 'Locale' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.PolicyBundle)
      .to(
        getModelForClass(Schemas.PolicyBundle, {
          options: { customName: 'PolicyBundle' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.PolicyThread)
      .to(
        getModelForClass(Schemas.PolicyThread, {
          options: { customName: 'PolicyThread' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.SystemAudit)
      .to(
        getModelForClass(Schemas.SystemAudit, {
          options: { customName: 'SystemAudit' },
          existingConnection: this.mongooseConnection,
        }),
      );

    this.app
      .bind(Bindings.WorkflowResult)
      .to(
        getModelForClass(Schemas.WorkflowResult, {
          options: { customName: 'WorkflowResult' },
          existingConnection: this.mongooseConnection,
        }),
      );

    /* Mongoose Schemas */

    this.app
      .bind(Bindings.Acknowledgement)
      .to(this.mongooseConnection.model('Acknowledgement', Schemas.Acknowledgement));

    this.app.bind(Bindings.ActionItem).to(this.mongooseConnection.model('ActionItem', Schemas.ActionItem));

    this.app.bind(Bindings.CalendarEvent).to(this.mongooseConnection.model('CalendarEvent', Schemas.CalendarEvent));

    this.app.bind(Bindings.Cancellation).to(this.mongooseConnection.model('Cancellation', Schemas.Cancellation));

    this.app
      .bind(Bindings.CompanyOverview)
      .to(this.mongooseConnection.model('CompanyOverview', Schemas.CompanyOverview));

    this.app.bind(Bindings.Company).to(this.mongooseConnection.model('Company', Schemas.Company));

    this.app
      .bind(Bindings.ConsumableToken)
      .to(this.mongooseConnection.model('ConsumableToken', Schemas.ConsumableToken));

    this.app.bind(Bindings.Configuration).to(this.mongooseConnection.model('Configuration', Schemas.Configuration));

    this.app.bind(Bindings.Conversation).to(this.mongooseConnection.model('Conversation', Schemas.Conversation));

    this.app.bind(Bindings.Document).to(this.mongooseConnection.model('Document', Schemas.Document));

    this.app.bind(Bindings.Emergency).to(this.mongooseConnection.model('Emergency', Schemas.Emergency));

    this.app.bind(Bindings.EmployeeNote).to(this.mongooseConnection.model('EmployeeNote', Schemas.EmployeeNote));

    this.app.bind(Bindings.EmployeeReview).to(this.mongooseConnection.model('EmployeeReview', Schemas.EmployeeReview));

    this.app.bind(Bindings.Event).to(this.mongooseConnection.model('Event', Schemas.Event));

    this.app.bind(Bindings.Feed).to(this.mongooseConnection.model('Feed', Schemas.Feed));

    this.app.bind(Bindings.File).to(this.mongooseConnection.model('File', Schemas.File));

    this.app.bind(Bindings.Filestack).to(this.mongooseConnection.model('Filestack', Schemas.Filestack));

    this.app.bind(Bindings.Folder).to(this.mongooseConnection.model('Folder', Schemas.Folder));

    this.app
      .bind(Bindings.GoogleWatchChannel)
      .to(this.mongooseConnection.model('GoogleWatchChannel', Schemas.GoogleWatchChannel));

    this.app.bind(Bindings.ModelLog).to(this.mongooseConnection.model('ModelLog', Schemas.ModelLog));

    this.app.bind(Bindings.Node).to(this.mongooseConnection.model('Node', Schemas.Node));

    this.app.bind(Bindings.Note).to(this.mongooseConnection.model('Note', Schemas.Note));

    this.app.bind(Bindings.PartnerUser).to(this.mongooseConnection.model('PartnerUser', Schemas.PartnerUser));

    this.app.bind(Bindings.Pip).to(this.mongooseConnection.model('Pip', Schemas.Pip));

    this.app.bind(Bindings.Policy).to(this.mongooseConnection.model('Policy', Schemas.Policy));

    this.app.bind(Bindings.Qna).to(this.mongooseConnection.model('Qna', Schemas.Qna));

    this.app.bind(Bindings.Question).to(this.mongooseConnection.model('Question', Schemas.Question));

    this.app.bind(Bindings.ReportCard).to(this.mongooseConnection.model('ReportCard', Schemas.ReportCard));

    this.app.bind(Bindings.Report).to(this.mongooseConnection.model('Report', Schemas.Report));

    this.app.bind(Bindings.Resignation).to(this.mongooseConnection.model('Resignation', Schemas.Resignation));

    this.app.bind(Bindings.Signature).to(this.mongooseConnection.model('Signature', Schemas.Signature));

    this.app.bind(Bindings.Step).to(this.mongooseConnection.model('Step', Schemas.Step));

    this.app.bind(Bindings.StripeEvent).to(this.mongooseConnection.model('StripeEvent', Schemas.StripeEvent));

    this.app.bind(Bindings.Ticket).to(this.mongooseConnection.model('Ticket', Schemas.Ticket));

    this.app.bind(Bindings.Termination).to(this.mongooseConnection.model('Termination', Schemas.Termination));

    this.app.bind(Bindings.Token).to(this.mongooseConnection.model('Token', Schemas.Token));

    this.app.bind(Bindings.Tree).to(this.mongooseConnection.model('Tree', Schemas.Tree));

    this.app.bind(Bindings.Unsubscribe).to(this.mongooseConnection.model('Unsubscribe', Schemas.Unsubscribe));

    this.app.bind(Bindings.UserProfile).to(this.mongooseConnection.model('UserProfile', Schemas.UserProfile));

    this.app.bind(Bindings.User).to(this.mongooseConnection.model('User', Schemas.User));

    this.app.bind(Bindings.Verbalwarning).to(this.mongooseConnection.model('Verbalwarning', Schemas.Verbalwarning));

    this.app.bind(Bindings.Version).to(this.mongooseConnection.model('Version', Schemas.Version));

    this.app.bind(Bindings.VonageCall).to(this.mongooseConnection.model('VonageCall', Schemas.VonageCall));

    this.app.bind(Bindings.Writtenwarning).to(this.mongooseConnection.model('Writtenwarning', Schemas.Writtenwarning));

    this.app
      .bind(Bindings.DuplicateCompany)
      .to(this.mongooseConnection.model('DuplicateCompany', Schemas.DuplicateCompany));

    /* Mongoose Event Discriminators */
    const eventModel = await this.app.get(Bindings.Event);
    const configurationModel = await this.app.get(Bindings.Configuration);
    this.app
      .bind(Bindings.AcknowledgeExpectationEvent)
      .to(eventModel.discriminator('AcknowledgeExpectation', Schemas.AcknowledgeExpectationEvent));
    this.app
      .bind(Bindings.AcknowledgementCancellationEvent)
      .to(eventModel.discriminator('AcknowledgementCancellation', Schemas.AcknowledgementCancellationEvent));
    this.app
      .bind(Bindings.AcknowledgementNotificationEvent)
      .to(eventModel.discriminator('AcknowledgementNotification', Schemas.AcknowledgementNotificationEvent));
    this.app
      .bind(Bindings.ActivatedEmployeeEvent)
      .to(eventModel.discriminator('ActivatedEmployee', Schemas.ActivatedEmployeeEvent));
    this.app
      .bind(Bindings.AddedEmployeesEvent)
      .to(eventModel.discriminator('AddedEmployees', Schemas.AddedEmployeesEvent));
    this.app
      .bind(Bindings.ApprovalApprovedEvent)
      .to(eventModel.discriminator('ApprovalApproved', Schemas.ApprovalApprovedEvent));
    this.app
      .bind(Bindings.ApprovalDeniedEvent)
      .to(eventModel.discriminator('ApprovalDenied', Schemas.ApprovalDeniedEvent));
    this.app
      .bind(Bindings.ApprovalRequestEvent)
      .to(eventModel.discriminator('ApprovalRequest', Schemas.ApprovalRequestEvent));
    this.app
      .bind(Bindings.AssignedAdvisorRoleEvent)
      .to(eventModel.discriminator('AssignedAdvisorRole', Schemas.AssignedAdvisorRoleEvent));
    this.app
      .bind(Bindings.AssignedAdvisorEvent)
      .to(eventModel.discriminator('AssignedAdvisor', Schemas.AssignedAdvisorEvent));
    this.app
      .bind(Bindings.AssignedSalesEvent)
      .to(eventModel.discriminator('AssignedSales', Schemas.AssignedSalesEvent));
    this.app.bind(Bindings.BciPageViewEvent).to(eventModel.discriminator('BciPageView', Schemas.BciPageViewEvent));
    this.app
      .bind(Bindings.CancelSubscriptionEvent)
      .to(eventModel.discriminator('CancelSubscription', Schemas.CancelSubscriptionEvent));
    this.app.bind(Bindings.CapCreatedEvent).to(eventModel.discriminator('CapCreated', Schemas.CapCreatedEvent));
    this.app
      .bind(Bindings.CompletedResignationCreatedEvent)
      .to(eventModel.discriminator('CompletedResignationCreated', Schemas.CompletedResignationCreatedEvent));
    this.app
      .bind(Bindings.CompletedTerminationCreatedEvent)
      .to(eventModel.discriminator('CompletedTerminationCreated', Schemas.CompletedTerminationCreatedEvent));
    this.app
      .bind(Bindings.CustomerRescheduledOverviewCallEvent)
      .to(eventModel.discriminator('CustomerRescheduledOverviewCall', Schemas.CustomerRescheduledOverviewCallEvent));
    this.app
      .bind(Bindings.CustomerScheduledGeneralCallEvent)
      .to(eventModel.discriminator('CustomerScheduledGeneralCall', Schemas.CustomerScheduledGeneralCallEvent));
    this.app
      .bind(Bindings.CustomerScheduledHrAuditCallEvent)
      .to(eventModel.discriminator('CustomerScheduledHrAuditCall', Schemas.CustomerScheduledHrAuditCallEvent));
    this.app
      .bind(Bindings.CustomerScheduledInitialCallEvent)
      .to(eventModel.discriminator('CustomerScheduledInitialCall', Schemas.CustomerScheduledInitialCallEvent));
    this.app
      .bind(Bindings.CustomerScheduledOverviewCallEvent)
      .to(eventModel.discriminator('CustomerScheduledOverviewCall', Schemas.CustomerScheduledOverviewCallEvent));
    this.app
      .bind(Bindings.CustomerScheduledPlatformCallEvent)
      .to(eventModel.discriminator('CustomerScheduledPlatformCall', Schemas.CustomerScheduledPlatformCallEvent));
    this.app
      .bind(Bindings.CustomerTicketCreatedEvent)
      .to(eventModel.discriminator('CustomerTicketCreated', Schemas.CustomerTicketCreatedEvent));
    this.app
      .bind(Bindings.EmployeeSelfSignupEvent)
      .to(eventModel.discriminator('EmployeeSelfSignup', Schemas.EmployeeSelfSignupEvent));
    this.app
      .bind(Bindings.EmployeesAddedEvent)
      .to(eventModel.discriminator('EmployeesAdded', Schemas.EmployeesAddedEvent));
    this.app
      .bind(Bindings.HandbookCompletedEvent)
      .to(eventModel.discriminator('HandbookCompleted', Schemas.HandbookCompletedEvent));
    this.app
      .bind(Bindings.HandbookStartedEvent)
      .to(eventModel.discriminator('HandbookStarted', Schemas.HandbookStartedEvent));
    this.app
      .bind(Bindings.HrAuditCompleteEvent)
      .to(eventModel.discriminator('HrAuditComplete', Schemas.HrAuditCompleteEvent));
    this.app
      .bind(Bindings.ImmediateCallRequestedEvent)
      .to(eventModel.discriminator('ImmediateCallRequested', Schemas.ImmediateCallRequestedEvent));
    this.app
      .bind(Bindings.InitialCallCompleteEvent)
      .to(eventModel.discriminator('InitialCallComplete', Schemas.InitialCallCompleteEvent));
    this.app
      .bind(Bindings.InsuranceEmailOutreachEvent)
      .to(eventModel.discriminator('InsuranceEmailOutreach', Schemas.InsuranceEmailOutreachEvent));
    this.app
      .bind(Bindings.InsuranceInterestEvent)
      .to(eventModel.discriminator('InsuranceInterest', Schemas.InsuranceInterestEvent));
    this.app.bind(Bindings.LoggedInEvent).to(eventModel.discriminator('LoggedIn', Schemas.LoggedInEvent));
    this.app
      .bind(Bindings.NewEmployeeWelcomeEvent)
      .to(eventModel.discriminator('NewEmployeeWelcome', Schemas.NewEmployeeWelcomeEvent));
    this.app.bind(Bindings.NewLeadEvent).to(eventModel.discriminator('NewLead', Schemas.NewLeadEvent));
    this.app
      .bind(Bindings.NewSubscriptionEvent)
      .to(eventModel.discriminator('NewSubscription', Schemas.NewSubscriptionEvent));
    this.app
      .bind(Bindings.NotifyCapSignatureRequestEvent)
      .to(eventModel.discriminator('NotifyCapSignatureRequest', Schemas.NotifyCapSignatureRequestEvent));
    this.app
      .bind(Bindings.OnboardingInProgressEvent)
      .to(eventModel.discriminator('OnboardingInProgress', Schemas.OnboardingInProgressEvent));
    this.app
      .bind(Bindings.OnlineOfferSelfSignupEvent)
      .to(eventModel.discriminator('OnlineOfferSelfSignup', Schemas.OnlineOfferSelfSignupEvent));
    this.app
      .bind(Bindings.OverviewCallCanceledEvent)
      .to(eventModel.discriminator('OverviewCallCanceled', Schemas.OverviewCallCanceledEvent));
    this.app
      .bind(Bindings.OverviewCallCompleteEvent)
      .to(eventModel.discriminator('OverviewCallComplete', Schemas.OverviewCallCompleteEvent));
    this.app
      .bind(Bindings.OverviewCallNoShowEvent)
      .to(eventModel.discriminator('OverviewCallNoShow', Schemas.OverviewCallNoShowEvent));
    this.app
      .bind(Bindings.OwnerActivatedAccountEvent)
      .to(eventModel.discriminator('OwnerActivatedAccount', Schemas.OwnerActivatedAccountEvent));
    this.app
      .bind(Bindings.PaymentFailureEvent)
      .to(eventModel.discriminator('PaymentFailure', Schemas.PaymentFailureEvent));
    this.app
      .bind(Bindings.PersonaCreatedEvent)
      .to(eventModel.discriminator('PersonaCreated', Schemas.PersonaCreatedEvent));
    this.app
      .bind(Bindings.PlatformTrainingCallActivatedEvent)
      .to(eventModel.discriminator('PlatformTrainingCallActivated', Schemas.PlatformTrainingCallActivatedEvent));
    this.app
      .bind(Bindings.PlatformTrainingCallCompleteEvent)
      .to(eventModel.discriminator('PlatformTrainingCallComplete', Schemas.PlatformTrainingCallCompleteEvent));
    this.app
      .bind(Bindings.PoliciesSentToStaffEvent)
      .to(eventModel.discriminator('PoliciesSentToStaff', Schemas.PoliciesSentToStaffEvent));
    this.app
      .bind(Bindings.PolicyApprovalRequestEvent)
      .to(eventModel.discriminator('PolicyApprovalRequest', Schemas.PolicyApprovalRequestEvent));
    this.app
      .bind(Bindings.PolicyApprovalEvent)
      .to(eventModel.discriminator('PolicyApproval', Schemas.PolicyApprovalEvent));
    this.app
      .bind(Bindings.PolicyCompletedEvent)
      .to(eventModel.discriminator('PolicyCompleted', Schemas.PolicyCompletedEvent));
    this.app
      .bind(Bindings.PolicyDeclineEvent)
      .to(eventModel.discriminator('PolicyDecline', Schemas.PolicyDeclineEvent));
    this.app
      .bind(Bindings.PolicyImplementedEvent)
      .to(eventModel.discriminator('PolicyImplemented', Schemas.PolicyImplementedEvent));
    this.app
      .bind(Bindings.PolicyPassedQAEvent)
      .to(eventModel.discriminator('PolicyPassedQA', Schemas.PolicyPassedQAEvent));
    this.app
      .bind(Bindings.PolicyReminderSentEvent)
      .to(eventModel.discriminator('PolicyReminderSent', Schemas.PolicyReminderSentEvent));
    this.app.bind(Bindings.PolicySignedEvent).to(eventModel.discriminator('PolicySigned', Schemas.PolicySignedEvent));
    this.app
      .bind(Bindings.ResendActivationEvent)
      .to(eventModel.discriminator('ResendActivation', Schemas.ResendActivationEvent));
    this.app
      .bind(Bindings.ResolvedCancellationEvent)
      .to(eventModel.discriminator('ResolvedCancellation', Schemas.ResolvedCancellationEvent));
    this.app
      .bind(Bindings.SalesLeadActiveEvent)
      .to(eventModel.discriminator('SalesLeadActive', Schemas.SalesLeadActiveEvent));
    this.app
      .bind(Bindings.SalesNotQualifiedEvent)
      .to(eventModel.discriminator('SalesNotQualified', Schemas.SalesNotQualifiedEvent));
    this.app.bind(Bindings.SalesNurtureEvent).to(eventModel.discriminator('SalesNurture', Schemas.SalesNurtureEvent));
    this.app
      .bind(Bindings.SalesQualifiedEvent)
      .to(eventModel.discriminator('SalesQualified', Schemas.SalesQualifiedEvent));
    this.app.bind(Bindings.SelfSignupEvent).to(eventModel.discriminator('SelfSignup', Schemas.SelfSignupEvent));
    this.app
      .bind(Bindings.SendSalesHrAuditScoreEvent)
      .to(eventModel.discriminator('SendSalesHrAuditScore', Schemas.SendSalesHrAuditScoreEvent));
    this.app
      .bind(Bindings.TerminationCreatedEvent)
      .to(eventModel.discriminator('TerminationCreated', Schemas.TerminationCreatedEvent));
    this.app
      .bind(Bindings.TerminationInProgressEvent)
      .to(eventModel.discriminator('TerminationInProgress', Schemas.TerminationInProgressEvent));
    this.app
      .bind(Bindings.UserProfileUpdatedEvent)
      .to(eventModel.discriminator('UserProfileUpdated', Schemas.UserProfileUpdatedEvent));
    this.app
      .bind(Bindings.UserTokenUsedEvent)
      .to(eventModel.discriminator('UserTokenUsed', Schemas.UserTokenUsedEvent));
    this.app
      .bind(Bindings.UserUpdatePasswordEvent)
      .to(eventModel.discriminator('UserUpdatePassword', Schemas.UserUpdatePasswordEvent));

    /* Mongoose Configuration Discriminators */
    this.app
      .bind(Bindings.CalendlyConfiguration)
      .to(configurationModel.discriminator('Calendly', Schemas.CalendlyConfiguration));
    this.app
      .bind(Bindings.CancellationReasonsConfiguration)
      .to(configurationModel.discriminator('CancellationReasons', Schemas.CancellationReasonsConfiguration));
    this.app
      .bind(Bindings.DefaultAdvisorConfiguration)
      .to(configurationModel.discriminator('DefaultAdvisor', Schemas.DefaultAdvisorConfiguration));
    this.app
      .bind(Bindings.DefaultChatOnlyConfiguration)
      .to(configurationModel.discriminator('DefaultChatOnly', Schemas.DefaultChatOnlyConfiguration));
    this.app
      .bind(Bindings.DefaultDuplicateCalculationConfiguration)
      .to(
        configurationModel.discriminator(
          'DefaultDuplicateCalculation',
          Schemas.DefaultDuplicateCalculationConfiguration,
        ),
      );
    this.app
      .bind(Bindings.DefaultInsuranceAgentConfiguration)
      .to(configurationModel.discriminator('DefaultInsuranceAgent', Schemas.DefaultInsuranceAgentConfiguration));
    this.app
      .bind(Bindings.DefaultOnboardingConfiguration)
      .to(configurationModel.discriminator('DefaultOnboarding', Schemas.DefaultOnboardingConfiguration));
    this.app
      .bind(Bindings.DefaultRequestTimeConfiguration)
      .to(configurationModel.discriminator('DefaultRequestTime', Schemas.DefaultRequestTimeConfiguration));
    this.app
      .bind(Bindings.DefaultSalesConfiguration)
      .to(configurationModel.discriminator('DefaultSales', Schemas.DefaultSalesConfiguration));
    this.app
      .bind(Bindings.DefaultTodosConfiguration)
      .to(configurationModel.discriminator('DefaultTodos', Schemas.DefaultTodosConfiguration));
    this.app
      .bind(Bindings.NewHireNoticeConfiguration)
      .to(configurationModel.discriminator('NewHireNotice', Schemas.NewHireNoticeConfiguration));
    this.app
      .bind(Bindings.NowcertsConfiguration)
      .to(configurationModel.discriminator('Nowcerts', Schemas.NowcertsConfiguration));
    this.app
      .bind(Bindings.PandaDocConfiguration)
      .to(configurationModel.discriminator('PandaDoc', Schemas.PandaDocConfiguration));
    this.app
      .bind(Bindings.RehireConfiguration)
      .to(configurationModel.discriminator('Rehire', Schemas.RehireConfiguration));
    this.app
      .bind(Bindings.SalesforceConfiguration)
      .to(configurationModel.discriminator('Salesforce', Schemas.SalesforceConfiguration));
    this.app
      .bind(Bindings.SystemConfiguration)
      .to(configurationModel.discriminator('System', Schemas.SystemConfiguration));
    this.app
      .bind(Bindings.VonageConfiguration)
      .to(configurationModel.discriminator('Vonage', Schemas.VonageConfiguration));
  }
}
