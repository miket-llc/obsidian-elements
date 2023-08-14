export interface Distinction {
    symbol: string
}

export interface Context extends Distinction {
    predicates: Predicate[]
}

export interface Predicate extends Distinction {
    value: string
}

export interface Definition extends Distinction {
    text: string
}