import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import {
    JournalTemplateLineRepository
} from '../../domain/interfaces/journal-template-line.repository.interface';

import {
    JournalTemplateLineEntity
} from '../../domain/entities/journal-template-line.entity';

import {
    JournalTemplateLineMapper
} from '../mappers/journal-template-line.mapper';



@Injectable()
export class PrismaJournalTemplateLineRepository
    implements JournalTemplateLineRepository {


    constructor(
        private readonly prisma: PrismaService,
    ) { }



    async save(
        entity: JournalTemplateLineEntity,
    ): Promise<void> {


        const data =
            JournalTemplateLineMapper
                .toPersistence(entity);



        await this.prisma.journalTemplateLine.create({
            data: {
                id: entity.getId(),
                ...data,
            },
        });

    }





    async findById(
        id: string,
    ): Promise<JournalTemplateLineEntity | null> {


        const record =
            await this.prisma.journalTemplateLine.findFirst({

                where: {
                    id,
                    deletedAt: null,
                },

            });



        if (!record) {
            return null;
        }



        return JournalTemplateLineMapper
            .toDomain(record);

    }





    async findAll(
        templateId: string,
    ): Promise<JournalTemplateLineEntity[]> {


        const records =
            await this.prisma.journalTemplateLine.findMany({

                where: {
                    templateId,
                    deletedAt: null,
                },


                orderBy: {
                    sortOrder: 'asc',
                },

            });



        return records.map(
            record =>
                JournalTemplateLineMapper
                    .toDomain(record)
        );

    }





    async update(
        entity: JournalTemplateLineEntity,
    ): Promise<void> {


        const data =
            JournalTemplateLineMapper
                .toPersistence(entity);



        await this.prisma.journalTemplateLine.update({

            where: {
                id: entity.getId(),
            },


            data,

        });

    }





    async delete(
        id: string,
    ): Promise<void> {


        await this.prisma.journalTemplateLine.update({

            where: {
                id,
            },


            data: {
                deletedAt: new Date(),
            },

        });

    }





    async exists(
        id: string,
    ): Promise<boolean> {


        const count =
            await this.prisma.journalTemplateLine.count({

                where: {
                    id,
                    deletedAt: null,
                },

            });



        return count > 0;

    }


}