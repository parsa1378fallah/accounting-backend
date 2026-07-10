import { Prisma } from '@prisma/client';
import { JournalTemplateLineEntity }
    from '../../domain/entities/journal-template-line.entity';

import { TemplateAmountType }
    from '../../domain/enums/template-amount-type.enum';


export class JournalTemplateLineMapper {


    static toDomain(
        raw: any,
    ): JournalTemplateLineEntity {


        return new JournalTemplateLineEntity(

            raw.id,

            {
                organizationId: raw.organizationId,

                templateId: raw.templateId,

                accountId: raw.accountId,

                isDebit: raw.isDebit,

                amountType:
                    raw.amountType as TemplateAmountType,


                amount:
                    raw.amount
                        ? Number(raw.amount)
                        : null,


                percentage:
                    raw.percentage
                        ? Number(raw.percentage)
                        : null,


                formula:
                    raw.formula ?? null,


                description:
                    raw.description,


                sortOrder:
                    raw.sortOrder,


                costCenterId:
                    raw.costCenterId,


                projectId:
                    raw.projectId,


                currencyId:
                    raw.currencyId,
            }
        );
    }



    static toPersistence(
        entity: JournalTemplateLineEntity,
    ) {


        const props =
            entity.getProps();


        return {

            organizationId:
                props.organizationId,


            templateId:
                props.templateId,


            accountId:
                props.accountId,


            isDebit:
                props.isDebit,


            amountType:
                props.amountType,


            amount:
                props.amount,


            percentage:
                props.percentage,


            formula:
                props.formula
                    ? props.formula as Prisma.InputJsonValue
                    : Prisma.DbNull,


            description:
                props.description,


            sortOrder:
                props.sortOrder,


            costCenterId:
                props.costCenterId,


            projectId:
                props.projectId,


            currencyId:
                props.currencyId,

        };
    }

}