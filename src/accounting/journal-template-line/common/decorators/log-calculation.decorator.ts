import { Logger } from '@nestjs/common';

export const LogCalculation = () => {
    const logger = new Logger('CalculationLogger');

    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const startTime = Date.now();
            logger.log(
                `Starting calculation for template: ${args[0]?.templateId}`,
            );

            try {
                const result = await originalMethod.apply(this, args);
                const executionTime = Date.now() - startTime;

                logger.log(
                    `Calculation completed in ${executionTime}ms for template: ${args[0]?.templateId}`,
                );

                return result;
            } catch (error) {
                const executionTime = Date.now() - startTime;
                logger.error(
                    `Calculation failed after ${executionTime}ms: ${error.message}`,
                );
                throw error;
            }
        };

        return descriptor;
    };
};