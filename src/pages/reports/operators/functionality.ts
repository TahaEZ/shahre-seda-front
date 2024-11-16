// module
import { toast } from 'react-toastify'
// custom
import operatorsApis from '../../../configs/server/opeators'
import instance from '../../../crud-service/instance'
import { OperatorTransactions } from '../../../models/entities/operator'
import { OperatorTransactionDetailsViewModel } from './model'
import toQueryDateString from '../../../utils/toQueryDateString'

export const getOperatorTransactions = async (
    id?: string,
    params?: { startDate?: string | null; endDate?: string | null },
): Promise<OperatorTransactions | void> => {
    if (!id) {
        toast.error('noOperatorWithThisId', {
            toastId: 'noOperatorWithThisIdToast',
        })
        return
    }

    const queryStartDate = params?.startDate
        ? new Date(params.startDate)
        : undefined
    queryStartDate?.setUTCHours(0, 0, 0, 0)

    const queryEndDate = params?.endDate ? new Date(params.endDate) : undefined
    queryEndDate?.setUTCHours(23, 59, 59, 999)

    const { data } = await instance.get<OperatorTransactions>(
        operatorsApis.getOperatorTransactions(id, {
            startDate: toQueryDateString(queryStartDate),
            endDate: toQueryDateString(queryEndDate),
        }),
    )
    return data
}

export const operatorTransactionDetailsColumns: {
    field: keyof OperatorTransactionDetailsViewModel
    headerName: string
    printWidth?: string | number
    width?: string | number
}[] = [
    { field: 'date', headerName: 'date' },
    { field: 'paymentDate', headerName: 'paymentDate' },
    { field: 'type', headerName: 'type' },
    { field: 'money', headerName: 'money' },
    { field: 'description', headerName: 'description', printWidth: '150px' },
    { field: 'customer', headerName: 'customer', printWidth: '125px' },
    { field: 'address', headerName: 'address', printWidth: '150px' },
]
