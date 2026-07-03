// src/modules/accounting/journal-template/validators/template-balance.validator.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { CreateJournalTemplateLineDto } from '../dto/create-journal-template-line.dto';
import { UpdateJournalTemplateDto } from '../dto/update-journal-template.dto';

@Injectable()
export class TemplateBalanceValidator {
    /**
     * اعتبارسنجی تعادل بدهکار و بستانکار خطوط قالب
     */
    validate(lines: CreateJournalTemplateLineDto[] | any[]): void {
        if (!lines || lines.length === 0) {
            throw new BadRequestException('قالب باید حداقل یک خط داشته باشد');
        }

        let totalDebit = new Decimal(0);
        let totalCredit = new Decimal(0);

        lines.forEach((line, index) => {
            // اعتبارسنجی وجود حساب
            if (!line.accountId) {
                throw new BadRequestException(`خط ${index + 1}: حساب الزامی است`);
            }

            // فقط خطوطی که مبلغ ثابت دارند را در محاسبه تعادل در نظر می‌گیریم
            if (line.amountType === 'FIXED' && line.amount !== null && line.amount !== undefined) {
                const amount = new Decimal(line.amount);

                if (amount.lessThan(0)) {
                    throw new BadRequestException(`خط ${index + 1}: مبلغ نمی‌تواند منفی باشد`);
                }

                if (line.isDebit) {
                    totalDebit = totalDebit.plus(amount);
                } else {
                    totalCredit = totalCredit.plus(amount);
                }
            }
        });

        // اگر حداقل یک خط با مبلغ ثابت وجود داشته باشد، باید تعادل برقرار باشد
        const hasFixedAmounts = lines.some(l => l.amountType === 'FIXED' && l.amount);

        if (hasFixedAmounts && !totalDebit.equals(totalCredit)) {
            throw new BadRequestException(
                `تعادل بدهکار و بستانکار برقرار نیست. بدهکار: ${totalDebit.toFixed(2)} | بستانکار: ${totalCredit.toFixed(2)}`,
            );
        }
    }

    /**
     * اعتبارسنجی برای به‌روزرسانی (اگر خطوط تغییر کرده باشند)
     */
    validateForUpdate(dto: UpdateJournalTemplateDto): void {
        if (dto.lines && dto.lines.length > 0) {
            this.validate(dto.lines);
        }
    }

    /**
     * اعتبارسنجی پیشرفته‌تر (اختیاری - برای آینده)
     */
    validateAdvanced(lines: any[], baseAmount?: Decimal): void {
        this.validate(lines);

        // می‌توانید در آینده منطق درصد، حداقل مبلغ، و غیره را اضافه کنید
        if (baseAmount) {
            const totalPercentage = lines
                .filter(l => l.amountType === 'PERCENT')
                .reduce((sum, l) => sum.plus(l.percentage || 0), new Decimal(0));

            if (totalPercentage.greaterThan(100)) {
                throw new BadRequestException('مجموع درصد خطوط نمی‌تواند بیشتر از ۱۰۰٪ باشد');
            }
        }
    }
}