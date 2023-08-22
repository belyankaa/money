export type MainDataType = {
    income: Array<MainDataOper>,
    expense: Array<MainDataOper>
}

export type MainDataOper = {
    category: string,
    amount: number
}