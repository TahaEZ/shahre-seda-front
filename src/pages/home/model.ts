import Customer from '../../models/entities/customer'
import Operator from '../../models/entities/operator'

export type OperatorReportForm = {
    operator: Operator | null
    startDate: Date | null
    endDate: Date | null
}

export type CustomerReportForm = {
    customer: Customer | null
    startDate: Date | null
    endDate: Date | null
}

export type OperatorPaymentForm = {
    operator: Operator | null
}

export type CustomerPaymentForm = {
    customer: Customer | null
}

export type RestoreBackupForm = {
    file: FileList | ''
}
