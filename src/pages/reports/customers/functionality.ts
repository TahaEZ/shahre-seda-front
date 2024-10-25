// module
import { toast } from 'react-toastify'
// custom
import instance from '../../../crud-service/instance'
import { CustomerTransactionDetailsViewModel } from './model'
import { CustomerTransactions } from '../../../models/entities/customer'
import customersApis from '../../../configs/server/customers'

export const getCustomerTransactions = async (
    id?: string,
    params?: { startDate?: string | null; endDate?: string | null },
): Promise<CustomerTransactions | void> => {
    if (!id) {
        toast.error('noOperatorWithThisId', {
            toastId: 'noOperatorWithThisIdToast',
        })
        return
    }

    const { data } = await instance.get<CustomerTransactions>(
        customersApis.getCustomerTransactions(id, {
            startDate: params?.startDate,
            endDate: params?.endDate,
        }),
    )
    return data
}

export const customerTransactionDetailsColumns: {
    field: keyof CustomerTransactionDetailsViewModel
    headerName: string
    printWidth?: string | number
    width?: string | number
}[] = [
    { field: 'date', headerName: 'date' },
    { field: 'type', headerName: 'type' },
    { field: 'money', headerName: 'money', printWidth: '150px' },
    { field: 'description', headerName: 'description', printWidth: '200px' },
    { field: 'address', headerName: 'address', printWidth: '200px' },
]
