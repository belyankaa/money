export type FormFieldsType = {
    name: string,
    id: string,
    element: HTMLElement | null,
    regex: RegExp,
    valid: boolean,
    textLog?: string,
    textReg: string
}