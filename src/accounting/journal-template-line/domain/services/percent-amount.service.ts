export class PercentAmountService {


    calculate(
        baseAmount: number,
        percentage: number,
    ): number {


        return (
            baseAmount *
            percentage /
            100
        );

    }

}