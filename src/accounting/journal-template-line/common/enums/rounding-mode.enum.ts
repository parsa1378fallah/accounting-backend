/**
 * تعریف روش‌های تقریب (Rounding Modes)
 *
 * این enum تمام روش‌های تقریب ممکن را تعریف می‌کند
 */
export enum RoundingMode {
    /**
     * ROUND_UP: همیشه رو به بالا
     * 2.1 -> 3, 2.9 -> 3, 2.5 -> 3
     */
    ROUND_UP = 'ROUND_UP',

    /**
     * ROUND_DOWN: همیشه رو به پایین
     * 2.1 -> 2, 2.9 -> 2, 2.5 -> 2
     */
    ROUND_DOWN = 'ROUND_DOWN',

    /**
     * ROUND_HALF_UP: نصف رو به بالا (استاندارد)
     * 2.1 -> 2, 2.9 -> 3, 2.5 -> 3
     */
    ROUND_HALF_UP = 'ROUND_HALF_UP',

    /**
     * ROUND_HALF_DOWN: نصف رو به پایین
     * 2.1 -> 2, 2.9 -> 3, 2.5 -> 2
     */
    ROUND_HALF_DOWN = 'ROUND_HALF_DOWN',

    /**
     * ROUND_CEILING: سقف (مشابه ROUND_UP اما برای اعداد منفی متفاوت)
     */
    ROUND_CEILING = 'ROUND_CEILING',

    /**
     * ROUND_FLOOR: کف (مشابه ROUND_DOWN اما برای اعداد منفی متفاوت)
     */
    ROUND_FLOOR = 'ROUND_FLOOR',

    /**
     * ROUND_HALF_EVEN: نصف به جفت (Banker's rounding)
     * 2.5 -> 2 (جفت), 3.5 -> 4 (جفت)
     */
    ROUND_HALF_EVEN = 'ROUND_HALF_EVEN',
}