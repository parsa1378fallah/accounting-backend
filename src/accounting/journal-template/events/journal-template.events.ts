// src/modules/accounting/journal-template/events/journal-template.events.ts
export const JOURNAL_TEMPLATE_EVENTS = {
    CREATED: 'journal-template.created',
    UPDATED: 'journal-template.updated',
    DELETED: 'journal-template.deleted',
    APPLIED: 'journal-template.applied',           // وقتی قالب به سند تبدیل شد
    RECURRING_EXECUTED: 'recurring-journal.executed',
    RECURRING_FAILED: 'recurring-journal.failed',
} as const;

export type JournalTemplateEventType = typeof JOURNAL_TEMPLATE_EVENTS[keyof typeof JOURNAL_TEMPLATE_EVENTS];