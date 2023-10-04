// module
import createCache from '@emotion/cache'
import stylisRTLPlugin from 'stylis-plugin-rtl'

const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [stylisRTLPlugin]
})

export default rtlCache
