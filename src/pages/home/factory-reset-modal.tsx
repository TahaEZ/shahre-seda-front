import {
    Box,
    Button,
    CircularProgress,
    Modal,
    Typography,
    useTheme,
} from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import instance from '../../crud-service/instance'

type IFactoryResetModalProps = {
    open: boolean
    onClose: () => void
}

const FactoryResetModal: FC<IFactoryResetModalProps> = ({ onClose, open }) => {
    const theme = useTheme()
    const { t } = useTranslation()

    const [isLoading, setIsLoading] = useState(false)

    const resetFactory = async () => {
        setIsLoading(true)
        try {
            await instance.post('/reset')
            toast.success(t('appResetSuccessfully'), {
                toastId: 'appResetSuccess',
            })
            onClose()
        } catch {
            toast.error(t('anErrorOccurred'), { toastId: 'serverError' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            open={open}
            onClose={!isLoading ? onClose : undefined}
            sx={{ alignItems: 'center', display: 'flex', zIndex: 0 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: (theme.palette.background as any)[
                        'surface1'
                    ],
                    borderRadius: '10px',
                    marginInline: 'auto',
                    p: 5,
                    pb: 5,
                    width: '60%',
                }}
            >
                <Typography variant="body1">
                    آیا می‌خواهید برنامه‌ی شما خام شود؟
                </Typography>
                <Typography mt={2} color="red" variant="body2">
                    تمامی اطلاعات فاکتورها، تراکنش‌های مشتری‌ها و اپراتورها،
                    سهام‌ها و سود دسته‌بندی‌ها پاک خواهد شد.
                </Typography>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'end',
                        gap: 4,
                        mt: 8,
                    }}
                >
                    <Button
                        disabled={isLoading}
                        variant="contained"
                        onClick={onClose}
                    >
                        لغو
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="contained"
                        color="error"
                        onClick={resetFactory}
                        sx={{ width: '225px' }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24.5} color="secondary" />
                        ) : (
                            'بله. می‌خواهم اطلاعات پاک شود.'
                        )}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default FactoryResetModal
