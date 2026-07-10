export interface AmountCalculationContext {

    baseAmount: number;

    previousAmount?: number;

    variables?: Record<
        string,
        number
    >;

}