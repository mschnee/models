/**
* This file was automatically generated at 2021-10-05T01:42:45.120Z.
* It should not be committed to git, and you shouldn't make any changes to it.
*/


import { getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import debugFactory from 'debug';
import { Connection, ConnectOptions, Model, Schema, SchemaDefinition, createConnection } from 'mongoose';
import * as Schemas from './types/schemas';
import { IModelOptions } from '@typegoose/typegoose/lib/types';

const log = debugFactory('com:bambee:models:ModelManager');

import { Auth as AuthSchema } from './schemas/typegoose/Auth.schema';
import { CompanyAdvisor as CompanyAdvisorSchema } from './schemas/typegoose/CompanyAdvisor.schema';
import { CompanyAdvisorAssignmentHistory as CompanyAdvisorAssignmentHistorySchema } from './schemas/typegoose/CompanyAdvisorAssignmentHistory.schema';
import { CompanyInsurancePlan as CompanyInsurancePlanSchema } from './schemas/typegoose/CompanyInsurancePlan.schema';
import { CompanyMilestone as CompanyMilestoneSchema } from './schemas/typegoose/CompanyMilestone.schema';
import { CompanyScore as CompanyScoreSchema } from './schemas/typegoose/CompanyScore.schema';
import { DocumentTemplate as DocumentTemplateSchema } from './schemas/typegoose/DocumentTemplate.schema';
import { InsuranceCarrier as InsuranceCarrierSchema } from './schemas/typegoose/InsuranceCarrier.schema';
import { LeadForm as LeadFormSchema } from './schemas/typegoose/LeadForm.schema';
import { Locale as LocaleSchema } from './schemas/typegoose/Locale.schema';
import { PolicyBundle as PolicyBundleSchema } from './schemas/typegoose/PolicyBundle.schema';
import { PolicyThread as PolicyThreadSchema } from './schemas/typegoose/PolicyThread.schema';
import { SystemAudit as SystemAuditSchema } from './schemas/typegoose/SystemAudit.schema';
import { WorkflowResult as WorkflowResultSchema } from './schemas/typegoose/WorkflowResult.schema';
export class ModelManager {
  public Auth: ReturnModelType<typeof AuthSchema>;
  public CompanyAdvisor: ReturnModelType<typeof CompanyAdvisorSchema>;
  public CompanyAdvisorAssignmentHistory: ReturnModelType<typeof CompanyAdvisorAssignmentHistorySchema>;
  public CompanyInsurancePlan: ReturnModelType<typeof CompanyInsurancePlanSchema>;
  public CompanyMilestone: ReturnModelType<typeof CompanyMilestoneSchema>;
  public CompanyScore: ReturnModelType<typeof CompanyScoreSchema>;
  public DocumentTemplate: ReturnModelType<typeof DocumentTemplateSchema>;
  public InsuranceCarrier: ReturnModelType<typeof InsuranceCarrierSchema>;
  public LeadForm: ReturnModelType<typeof LeadFormSchema>;
  public Locale: ReturnModelType<typeof LocaleSchema>;
  public PolicyBundle: ReturnModelType<typeof PolicyBundleSchema>;
  public PolicyThread: ReturnModelType<typeof PolicyThreadSchema>;
  public SystemAudit: ReturnModelType<typeof SystemAuditSchema>;
  public WorkflowResult: ReturnModelType<typeof WorkflowResultSchema>;
  public Acknowledgement: Model<any>;
  public ActionItem: Model<any>;
  public CalendarEvent: Model<any>;
  public Cancellation: Model<any>;
  public CompanyOverview: Model<any>;
  public Company: Model<any>;
  public ConsumableToken: Model<any>;
  public Configuration: Model<any>;
  public Conversation: Model<any>;
  public Document: Model<any>;
  public Emergency: Model<any>;
  public EmployeeNote: Model<any>;
  public EmployeeReview: Model<any>;
  public Event: Model<any>;
  public Feed: Model<any>;
  public File: Model<any>;
  public Filestack: Model<any>;
  public Folder: Model<any>;
  public GoogleWatchChannel: Model<any>;
  public ModelLog: Model<any>;
  public Node: Model<any>;
  public Note: Model<any>;
  public PartnerUser: Model<any>;
  public Pip: Model<any>;
  public Policy: Model<any>;
  public Qna: Model<any>;
  public Question: Model<any>;
  public ReportCard: Model<any>;
  public Report: Model<any>;
  public Resignation: Model<any>;
  public Signature: Model<any>;
  public Step: Model<any>;
  public StripeEvent: Model<any>;
  public Ticket: Model<any>;
  public Termination: Model<any>;
  public Token: Model<any>;
  public Tree: Model<any>;
  public Unsubscribe: Model<any>;
  public UserProfile: Model<any>;
  public User: Model<any>;
  public Verbalwarning: Model<any>;
  public Version: Model<any>;
  public VonageCall: Model<any>;
  public Writtenwarning: Model<any>;
  public DuplicateCompany: Model<any>;
  public AcknowledgeExpectationEvent: Model<any>;
  public AcknowledgementCancellationEvent: Model<any>;
  public AcknowledgementNotificationEvent: Model<any>;
  public ActivatedEmployeeEvent: Model<any>;
  public AddedEmployeesEvent: Model<any>;
  public ApprovalApprovedEvent: Model<any>;
  public ApprovalDeniedEvent: Model<any>;
  public ApprovalRequestEvent: Model<any>;
  public AssignedAdvisorRoleEvent: Model<any>;
  public AssignedAdvisorEvent: Model<any>;
  public AssignedSalesEvent: Model<any>;
  public BciPageViewEvent: Model<any>;
  public CancelSubscriptionEvent: Model<any>;
  public CapCreatedEvent: Model<any>;
  public CompletedResignationCreatedEvent: Model<any>;
  public CompletedTerminationCreatedEvent: Model<any>;
  public CustomerRescheduledOverviewCallEvent: Model<any>;
  public CustomerScheduledGeneralCallEvent: Model<any>;
  public CustomerScheduledHrAuditCallEvent: Model<any>;
  public CustomerScheduledInitialCallEvent: Model<any>;
  public CustomerScheduledOverviewCallEvent: Model<any>;
  public CustomerScheduledPlatformCallEvent: Model<any>;
  public CustomerTicketCreatedEvent: Model<any>;
  public EmployeeSelfSignupEvent: Model<any>;
  public EmployeesAddedEvent: Model<any>;
  public HandbookCompletedEvent: Model<any>;
  public HandbookStartedEvent: Model<any>;
  public HrAuditCompleteEvent: Model<any>;
  public ImmediateCallRequestedEvent: Model<any>;
  public InitialCallCompleteEvent: Model<any>;
  public InsuranceEmailOutreachEvent: Model<any>;
  public InsuranceInterestEvent: Model<any>;
  public LoggedInEvent: Model<any>;
  public NewEmployeeWelcomeEvent: Model<any>;
  public NewLeadEvent: Model<any>;
  public NewSubscriptionEvent: Model<any>;
  public NotifyCapSignatureRequestEvent: Model<any>;
  public OnboardingInProgressEvent: Model<any>;
  public OnlineOfferSelfSignupEvent: Model<any>;
  public OverviewCallCanceledEvent: Model<any>;
  public OverviewCallCompleteEvent: Model<any>;
  public OverviewCallNoShowEvent: Model<any>;
  public OwnerActivatedAccountEvent: Model<any>;
  public PaymentFailureEvent: Model<any>;
  public PersonaCreatedEvent: Model<any>;
  public PlatformTrainingCallActivatedEvent: Model<any>;
  public PlatformTrainingCallCompleteEvent: Model<any>;
  public PoliciesSentToStaffEvent: Model<any>;
  public PolicyApprovalRequestEvent: Model<any>;
  public PolicyApprovalEvent: Model<any>;
  public PolicyCompletedEvent: Model<any>;
  public PolicyDeclineEvent: Model<any>;
  public PolicyImplementedEvent: Model<any>;
  public PolicyPassedQAEvent: Model<any>;
  public PolicyReminderSentEvent: Model<any>;
  public PolicySignedEvent: Model<any>;
  public ResendActivationEvent: Model<any>;
  public ResolvedCancellationEvent: Model<any>;
  public SalesLeadActiveEvent: Model<any>;
  public SalesNotQualifiedEvent: Model<any>;
  public SalesNurtureEvent: Model<any>;
  public SalesQualifiedEvent: Model<any>;
  public SelfSignupEvent: Model<any>;
  public SendSalesHrAuditScoreEvent: Model<any>;
  public TerminationCreatedEvent: Model<any>;
  public TerminationInProgressEvent: Model<any>;
  public UserProfileUpdatedEvent: Model<any>;
  public UserTokenUsedEvent: Model<any>;
  public UserUpdatePasswordEvent: Model<any>;
  public CalendlyConfiguration: Model<any>;
  public CancellationReasonsConfiguration: Model<any>;
  public DefaultAdvisorConfiguration: Model<any>;
  public DefaultChatOnlyConfiguration: Model<any>;
  public DefaultDuplicateCalculationConfiguration: Model<any>;
  public DefaultInsuranceAgentConfiguration: Model<any>;
  public DefaultOnboardingConfiguration: Model<any>;
  public DefaultRequestTimeConfiguration: Model<any>;
  public DefaultSalesConfiguration: Model<any>;
  public DefaultTodosConfiguration: Model<any>;
  public NewHireNoticeConfiguration: Model<any>;
  public NowcertsConfiguration: Model<any>;
  public PandaDocConfiguration: Model<any>;
  public RehireConfiguration: Model<any>;
  public SalesforceConfiguration: Model<any>;
  public SystemConfiguration: Model<any>;
  public VonageConfiguration: Model<any>;

  private connection: Connection = null;
  private isSetup = false;

  buildTestModel(name: string, s: SchemaDefinition): Model<any> {
    let m = null
    try {
      m = this.connection.model(name);
    } catch (e) {
      // noop
    }
    if (m) {
      return m;
    } else {
      return this.connection.model(name, new Schema(s));
    }
  }

  async setup(uri: string, options?: ConnectOptions): Promise<void> {
    if (this.isSetup) {
      return;
    }

    this.connection = await createConnection(uri, options);
    this.buildModels();
  }

  async close(): Promise<void> {
    await this.connection.close();
  }
  buildModels(): void {
    const configOptions: Partial<IModelOptions> = {};
    configOptions.existingConnection = this.connection;

    /* Typegoose Schemas */
    this.Auth = getModelForClass(AuthSchema, { options: { customName: 'Auth' }, ...configOptions });
    this.CompanyAdvisor = getModelForClass(CompanyAdvisorSchema, { options: { customName: 'CompanyAdvisor' }, ...configOptions });
    this.CompanyAdvisorAssignmentHistory = getModelForClass(CompanyAdvisorAssignmentHistorySchema, { options: { customName: 'CompanyAdvisorAssignmentHistory' }, ...configOptions });
    this.CompanyInsurancePlan = getModelForClass(CompanyInsurancePlanSchema, { options: { customName: 'CompanyInsurancePlan' }, ...configOptions });
    this.CompanyMilestone = getModelForClass(CompanyMilestoneSchema, { options: { customName: 'CompanyMilestone' }, ...configOptions });
    this.CompanyScore = getModelForClass(CompanyScoreSchema, { options: { customName: 'CompanyScore' }, ...configOptions });
    this.DocumentTemplate = getModelForClass(DocumentTemplateSchema, { options: { customName: 'DocumentTemplate' }, ...configOptions });
    this.InsuranceCarrier = getModelForClass(InsuranceCarrierSchema, { options: { customName: 'InsuranceCarrier' }, ...configOptions });
    this.LeadForm = getModelForClass(LeadFormSchema, { options: { customName: 'LeadForm' }, ...configOptions });
    this.Locale = getModelForClass(LocaleSchema, { options: { customName: 'Locale' }, ...configOptions });
    this.PolicyBundle = getModelForClass(PolicyBundleSchema, { options: { customName: 'PolicyBundle' }, ...configOptions });
    this.PolicyThread = getModelForClass(PolicyThreadSchema, { options: { customName: 'PolicyThread' }, ...configOptions });
    this.SystemAudit = getModelForClass(SystemAuditSchema, { options: { customName: 'SystemAudit' }, ...configOptions });
    this.WorkflowResult = getModelForClass(WorkflowResultSchema, { options: { customName: 'WorkflowResult' }, ...configOptions });

    /* Mongoose Schemas */
    this.Acknowledgement = this.connection.model('Acknowledgement', Schemas.Acknowledgement);
    this.ActionItem = this.connection.model('ActionItem', Schemas.ActionItem);
    this.CalendarEvent = this.connection.model('CalendarEvent', Schemas.CalendarEvent);
    this.Cancellation = this.connection.model('Cancellation', Schemas.Cancellation);
    this.CompanyOverview = this.connection.model('CompanyOverview', Schemas.CompanyOverview);
    this.Company = this.connection.model('Company', Schemas.Company);
    this.ConsumableToken = this.connection.model('ConsumableToken', Schemas.ConsumableToken);
    this.Configuration = this.connection.model('Configuration', Schemas.Configuration);
    this.Conversation = this.connection.model('Conversation', Schemas.Conversation);
    this.Document = this.connection.model('Document', Schemas.Document);
    this.Emergency = this.connection.model('Emergency', Schemas.Emergency);
    this.EmployeeNote = this.connection.model('EmployeeNote', Schemas.EmployeeNote);
    this.EmployeeReview = this.connection.model('EmployeeReview', Schemas.EmployeeReview);
    this.Event = this.connection.model('Event', Schemas.Event);
    this.Feed = this.connection.model('Feed', Schemas.Feed);
    this.File = this.connection.model('File', Schemas.File);
    this.Filestack = this.connection.model('Filestack', Schemas.Filestack);
    this.Folder = this.connection.model('Folder', Schemas.Folder);
    this.GoogleWatchChannel = this.connection.model('GoogleWatchChannel', Schemas.GoogleWatchChannel);
    this.ModelLog = this.connection.model('ModelLog', Schemas.ModelLog);
    this.Node = this.connection.model('Node', Schemas.Node);
    this.Note = this.connection.model('Note', Schemas.Note);
    this.PartnerUser = this.connection.model('PartnerUser', Schemas.PartnerUser);
    this.Pip = this.connection.model('Pip', Schemas.Pip);
    this.Policy = this.connection.model('Policy', Schemas.Policy);
    this.Qna = this.connection.model('Qna', Schemas.Qna);
    this.Question = this.connection.model('Question', Schemas.Question);
    this.ReportCard = this.connection.model('ReportCard', Schemas.ReportCard);
    this.Report = this.connection.model('Report', Schemas.Report);
    this.Resignation = this.connection.model('Resignation', Schemas.Resignation);
    this.Signature = this.connection.model('Signature', Schemas.Signature);
    this.Step = this.connection.model('Step', Schemas.Step);
    this.StripeEvent = this.connection.model('StripeEvent', Schemas.StripeEvent);
    this.Ticket = this.connection.model('Ticket', Schemas.Ticket);
    this.Termination = this.connection.model('Termination', Schemas.Termination);
    this.Token = this.connection.model('Token', Schemas.Token);
    this.Tree = this.connection.model('Tree', Schemas.Tree);
    this.Unsubscribe = this.connection.model('Unsubscribe', Schemas.Unsubscribe);
    this.UserProfile = this.connection.model('UserProfile', Schemas.UserProfile);
    this.User = this.connection.model('User', Schemas.User);
    this.Verbalwarning = this.connection.model('Verbalwarning', Schemas.Verbalwarning);
    this.Version = this.connection.model('Version', Schemas.Version);
    this.VonageCall = this.connection.model('VonageCall', Schemas.VonageCall);
    this.Writtenwarning = this.connection.model('Writtenwarning', Schemas.Writtenwarning);
    this.DuplicateCompany = this.connection.model('DuplicateCompany', Schemas.DuplicateCompany);

    /* Mongoose Event Discriminators */
    this.AcknowledgeExpectationEvent = this.Event.discriminator('AcknowledgeExpectation', Schemas.AcknowledgeExpectationEvent);
    this.AcknowledgementCancellationEvent = this.Event.discriminator('AcknowledgementCancellation', Schemas.AcknowledgementCancellationEvent);
    this.AcknowledgementNotificationEvent = this.Event.discriminator('AcknowledgementNotification', Schemas.AcknowledgementNotificationEvent);
    this.ActivatedEmployeeEvent = this.Event.discriminator('ActivatedEmployee', Schemas.ActivatedEmployeeEvent);
    this.AddedEmployeesEvent = this.Event.discriminator('AddedEmployees', Schemas.AddedEmployeesEvent);
    this.ApprovalApprovedEvent = this.Event.discriminator('ApprovalApproved', Schemas.ApprovalApprovedEvent);
    this.ApprovalDeniedEvent = this.Event.discriminator('ApprovalDenied', Schemas.ApprovalDeniedEvent);
    this.ApprovalRequestEvent = this.Event.discriminator('ApprovalRequest', Schemas.ApprovalRequestEvent);
    this.AssignedAdvisorRoleEvent = this.Event.discriminator('AssignedAdvisorRole', Schemas.AssignedAdvisorRoleEvent);
    this.AssignedAdvisorEvent = this.Event.discriminator('AssignedAdvisor', Schemas.AssignedAdvisorEvent);
    this.AssignedSalesEvent = this.Event.discriminator('AssignedSales', Schemas.AssignedSalesEvent);
    this.BciPageViewEvent = this.Event.discriminator('BciPageView', Schemas.BciPageViewEvent);
    this.CancelSubscriptionEvent = this.Event.discriminator('CancelSubscription', Schemas.CancelSubscriptionEvent);
    this.CapCreatedEvent = this.Event.discriminator('CapCreated', Schemas.CapCreatedEvent);
    this.CompletedResignationCreatedEvent = this.Event.discriminator('CompletedResignationCreated', Schemas.CompletedResignationCreatedEvent);
    this.CompletedTerminationCreatedEvent = this.Event.discriminator('CompletedTerminationCreated', Schemas.CompletedTerminationCreatedEvent);
    this.CustomerRescheduledOverviewCallEvent = this.Event.discriminator('CustomerRescheduledOverviewCall', Schemas.CustomerRescheduledOverviewCallEvent);
    this.CustomerScheduledGeneralCallEvent = this.Event.discriminator('CustomerScheduledGeneralCall', Schemas.CustomerScheduledGeneralCallEvent);
    this.CustomerScheduledHrAuditCallEvent = this.Event.discriminator('CustomerScheduledHrAuditCall', Schemas.CustomerScheduledHrAuditCallEvent);
    this.CustomerScheduledInitialCallEvent = this.Event.discriminator('CustomerScheduledInitialCall', Schemas.CustomerScheduledInitialCallEvent);
    this.CustomerScheduledOverviewCallEvent = this.Event.discriminator('CustomerScheduledOverviewCall', Schemas.CustomerScheduledOverviewCallEvent);
    this.CustomerScheduledPlatformCallEvent = this.Event.discriminator('CustomerScheduledPlatformCall', Schemas.CustomerScheduledPlatformCallEvent);
    this.CustomerTicketCreatedEvent = this.Event.discriminator('CustomerTicketCreated', Schemas.CustomerTicketCreatedEvent);
    this.EmployeeSelfSignupEvent = this.Event.discriminator('EmployeeSelfSignup', Schemas.EmployeeSelfSignupEvent);
    this.EmployeesAddedEvent = this.Event.discriminator('EmployeesAdded', Schemas.EmployeesAddedEvent);
    this.HandbookCompletedEvent = this.Event.discriminator('HandbookCompleted', Schemas.HandbookCompletedEvent);
    this.HandbookStartedEvent = this.Event.discriminator('HandbookStarted', Schemas.HandbookStartedEvent);
    this.HrAuditCompleteEvent = this.Event.discriminator('HrAuditComplete', Schemas.HrAuditCompleteEvent);
    this.ImmediateCallRequestedEvent = this.Event.discriminator('ImmediateCallRequested', Schemas.ImmediateCallRequestedEvent);
    this.InitialCallCompleteEvent = this.Event.discriminator('InitialCallComplete', Schemas.InitialCallCompleteEvent);
    this.InsuranceEmailOutreachEvent = this.Event.discriminator('InsuranceEmailOutreach', Schemas.InsuranceEmailOutreachEvent);
    this.InsuranceInterestEvent = this.Event.discriminator('InsuranceInterest', Schemas.InsuranceInterestEvent);
    this.LoggedInEvent = this.Event.discriminator('LoggedIn', Schemas.LoggedInEvent);
    this.NewEmployeeWelcomeEvent = this.Event.discriminator('NewEmployeeWelcome', Schemas.NewEmployeeWelcomeEvent);
    this.NewLeadEvent = this.Event.discriminator('NewLead', Schemas.NewLeadEvent);
    this.NewSubscriptionEvent = this.Event.discriminator('NewSubscription', Schemas.NewSubscriptionEvent);
    this.NotifyCapSignatureRequestEvent = this.Event.discriminator('NotifyCapSignatureRequest', Schemas.NotifyCapSignatureRequestEvent);
    this.OnboardingInProgressEvent = this.Event.discriminator('OnboardingInProgress', Schemas.OnboardingInProgressEvent);
    this.OnlineOfferSelfSignupEvent = this.Event.discriminator('OnlineOfferSelfSignup', Schemas.OnlineOfferSelfSignupEvent);
    this.OverviewCallCanceledEvent = this.Event.discriminator('OverviewCallCanceled', Schemas.OverviewCallCanceledEvent);
    this.OverviewCallCompleteEvent = this.Event.discriminator('OverviewCallComplete', Schemas.OverviewCallCompleteEvent);
    this.OverviewCallNoShowEvent = this.Event.discriminator('OverviewCallNoShow', Schemas.OverviewCallNoShowEvent);
    this.OwnerActivatedAccountEvent = this.Event.discriminator('OwnerActivatedAccount', Schemas.OwnerActivatedAccountEvent);
    this.PaymentFailureEvent = this.Event.discriminator('PaymentFailure', Schemas.PaymentFailureEvent);
    this.PersonaCreatedEvent = this.Event.discriminator('PersonaCreated', Schemas.PersonaCreatedEvent);
    this.PlatformTrainingCallActivatedEvent = this.Event.discriminator('PlatformTrainingCallActivated', Schemas.PlatformTrainingCallActivatedEvent);
    this.PlatformTrainingCallCompleteEvent = this.Event.discriminator('PlatformTrainingCallComplete', Schemas.PlatformTrainingCallCompleteEvent);
    this.PoliciesSentToStaffEvent = this.Event.discriminator('PoliciesSentToStaff', Schemas.PoliciesSentToStaffEvent);
    this.PolicyApprovalRequestEvent = this.Event.discriminator('PolicyApprovalRequest', Schemas.PolicyApprovalRequestEvent);
    this.PolicyApprovalEvent = this.Event.discriminator('PolicyApproval', Schemas.PolicyApprovalEvent);
    this.PolicyCompletedEvent = this.Event.discriminator('PolicyCompleted', Schemas.PolicyCompletedEvent);
    this.PolicyDeclineEvent = this.Event.discriminator('PolicyDecline', Schemas.PolicyDeclineEvent);
    this.PolicyImplementedEvent = this.Event.discriminator('PolicyImplemented', Schemas.PolicyImplementedEvent);
    this.PolicyPassedQAEvent = this.Event.discriminator('PolicyPassedQA', Schemas.PolicyPassedQAEvent);
    this.PolicyReminderSentEvent = this.Event.discriminator('PolicyReminderSent', Schemas.PolicyReminderSentEvent);
    this.PolicySignedEvent = this.Event.discriminator('PolicySigned', Schemas.PolicySignedEvent);
    this.ResendActivationEvent = this.Event.discriminator('ResendActivation', Schemas.ResendActivationEvent);
    this.ResolvedCancellationEvent = this.Event.discriminator('ResolvedCancellation', Schemas.ResolvedCancellationEvent);
    this.SalesLeadActiveEvent = this.Event.discriminator('SalesLeadActive', Schemas.SalesLeadActiveEvent);
    this.SalesNotQualifiedEvent = this.Event.discriminator('SalesNotQualified', Schemas.SalesNotQualifiedEvent);
    this.SalesNurtureEvent = this.Event.discriminator('SalesNurture', Schemas.SalesNurtureEvent);
    this.SalesQualifiedEvent = this.Event.discriminator('SalesQualified', Schemas.SalesQualifiedEvent);
    this.SelfSignupEvent = this.Event.discriminator('SelfSignup', Schemas.SelfSignupEvent);
    this.SendSalesHrAuditScoreEvent = this.Event.discriminator('SendSalesHrAuditScore', Schemas.SendSalesHrAuditScoreEvent);
    this.TerminationCreatedEvent = this.Event.discriminator('TerminationCreated', Schemas.TerminationCreatedEvent);
    this.TerminationInProgressEvent = this.Event.discriminator('TerminationInProgress', Schemas.TerminationInProgressEvent);
    this.UserProfileUpdatedEvent = this.Event.discriminator('UserProfileUpdated', Schemas.UserProfileUpdatedEvent);
    this.UserTokenUsedEvent = this.Event.discriminator('UserTokenUsed', Schemas.UserTokenUsedEvent);
    this.UserUpdatePasswordEvent = this.Event.discriminator('UserUpdatePassword', Schemas.UserUpdatePasswordEvent);

    /* Mongoose Configuration Discriminators */
    this.CalendlyConfiguration = this.Configuration.discriminator('Calendly', Schemas.CalendlyConfiguration);
    this.CancellationReasonsConfiguration = this.Configuration.discriminator('CancellationReasons', Schemas.CancellationReasonsConfiguration);
    this.DefaultAdvisorConfiguration = this.Configuration.discriminator('DefaultAdvisor', Schemas.DefaultAdvisorConfiguration);
    this.DefaultChatOnlyConfiguration = this.Configuration.discriminator('DefaultChatOnly', Schemas.DefaultChatOnlyConfiguration);
    this.DefaultDuplicateCalculationConfiguration = this.Configuration.discriminator('DefaultDuplicateCalculation', Schemas.DefaultDuplicateCalculationConfiguration);
    this.DefaultInsuranceAgentConfiguration = this.Configuration.discriminator('DefaultInsuranceAgent', Schemas.DefaultInsuranceAgentConfiguration);
    this.DefaultOnboardingConfiguration = this.Configuration.discriminator('DefaultOnboarding', Schemas.DefaultOnboardingConfiguration);
    this.DefaultRequestTimeConfiguration = this.Configuration.discriminator('DefaultRequestTime', Schemas.DefaultRequestTimeConfiguration);
    this.DefaultSalesConfiguration = this.Configuration.discriminator('DefaultSales', Schemas.DefaultSalesConfiguration);
    this.DefaultTodosConfiguration = this.Configuration.discriminator('DefaultTodos', Schemas.DefaultTodosConfiguration);
    this.NewHireNoticeConfiguration = this.Configuration.discriminator('NewHireNotice', Schemas.NewHireNoticeConfiguration);
    this.NowcertsConfiguration = this.Configuration.discriminator('Nowcerts', Schemas.NowcertsConfiguration);
    this.PandaDocConfiguration = this.Configuration.discriminator('PandaDoc', Schemas.PandaDocConfiguration);
    this.RehireConfiguration = this.Configuration.discriminator('Rehire', Schemas.RehireConfiguration);
    this.SalesforceConfiguration = this.Configuration.discriminator('Salesforce', Schemas.SalesforceConfiguration);
    this.SystemConfiguration = this.Configuration.discriminator('System', Schemas.SystemConfiguration);
    this.VonageConfiguration = this.Configuration.discriminator('Vonage', Schemas.VonageConfiguration);

  }

}
