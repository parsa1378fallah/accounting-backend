import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';


import { randomUUID } from 'crypto';


import {
    JOURNAL_TEMPLATE_LINE_REPOSITORY,
} from './domain/constants/repository.tokens';


import type {
    JournalTemplateLineRepository,
} from './domain/interfaces/journal-template-line.repository.interface';


import {
    JournalTemplateLineEntity,
} from './domain/entities/journal-template-line.entity';


import {
    CreateJournalTemplateLineDto,
} from './dto/create-journal-template-line.dto';


import {
    UpdateJournalTemplateLineDto,
} from './dto/update-journal-template-line.dto';


import {
    QueryJournalTemplateLineDto,
} from './dto/query-journal-template-line.dto';



@Injectable()
export class JournalTemplateLineService {


    constructor(

        @Inject(
            JOURNAL_TEMPLATE_LINE_REPOSITORY,
        )
        private readonly repository:
            JournalTemplateLineRepository,

    ) { }



    async create(
        dto: CreateJournalTemplateLineDto,
    ) {


        const entity =
            new JournalTemplateLineEntity(

                randomUUID(),

                {
                    organizationId:
                        dto.organizationId,


                    templateId:
                        dto.templateId,


                    accountId:
                        dto.accountId,


                    isDebit:
                        dto.isDebit,


                    amountType:
                        dto.amountType,


                    amount:
                        dto.amount ?? null,


                    percentage:
                        dto.percentage ?? null,


                    formula:
                        dto.formula ?? null,


                    description:
                        dto.description ?? null,


                    sortOrder:
                        dto.sortOrder ?? 0,


                    costCenterId:
                        dto.costCenterId ?? null,


                    projectId:
                        dto.projectId ?? null,


                    currencyId:
                        dto.currencyId ?? null,

                },

            );



        await this.repository.save(entity);



        return entity.getProps();

    }






    async findOne(
        id: string,
    ) {


        const entity =
            await this.repository.findById(id);



        if (!entity) {

            throw new NotFoundException(
                'Journal template line not found',
            );

        }



        return entity.getProps();

    }






    async findAll(
        query: QueryJournalTemplateLineDto,
    ) {


        if (!query.templateId) {

            return [];

        }



        const entities =
            await this.repository.findAll(
                query.templateId,
            );



        return entities.map(
            entity =>
                entity.getProps(),
        );

    }






    async update(
        id: string,
        dto: UpdateJournalTemplateLineDto,
    ) {


        const entity =
            await this.repository.findById(id);



        if (!entity) {

            throw new NotFoundException(
                'Journal template line not found',
            );

        }



        const current =
            entity.getProps();



        const updated =
            new JournalTemplateLineEntity(

                id,

                {

                    ...current,


                    ...dto,

                },

            );



        await this.repository.update(
            updated,
        );



        return updated.getProps();

    }







    async remove(
        id: string,
    ) {


        const exists =
            await this.repository.exists(id);



        if (!exists) {

            throw new NotFoundException(
                'Journal template line not found',
            );

        }



        await this.repository.delete(id);



        return {
            success: true,
        };

    }


}