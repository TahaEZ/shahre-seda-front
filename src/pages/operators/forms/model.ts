import type Operator from '../../../models/entities/operator'

export type OperatorForm = Operator

export type OperatorViewModel = Omit<Operator, 'firstName' | 'lastName'> & {
    name: string
}
