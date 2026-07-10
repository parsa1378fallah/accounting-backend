export class FormulaValidator {


    static validate(
        formula?: Record<string, unknown> | null,
    ): void {


        if (!formula) {
            throw new Error(
                'Formula is required',
            );
        }



        if (
            Object.keys(formula).length === 0
        ) {
            throw new Error(
                'Formula cannot be empty',
            );
        }

    }

}