export interface FileSignature {
    mime: string;

    bytes: number[];

    offset?: number;
}