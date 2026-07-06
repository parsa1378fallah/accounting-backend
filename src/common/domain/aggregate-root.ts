export abstract class AggregateRoot {
    private readonly domainEvents: object[] = [];

    protected addDomainEvent(event: object): void {
        this.domainEvents.push(event);
    }

    pullDomainEvents(): object[] {
        const events = [...this.domainEvents];

        this.domainEvents.length = 0;

        return events;
    }

    getDomainEvents(): readonly object[] {
        return this.domainEvents;
    }

    clearDomainEvents(): void {
        this.domainEvents.length = 0;
    }

    hasDomainEvents(): boolean {
        return this.domainEvents.length > 0;
    }
}