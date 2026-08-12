import rollupFiles from 'w-package-tools/src/rollupFiles.mjs'
import getFiles from 'w-package-tools/src/getFiles.mjs'


let fdSrc = './src'
let fdTar = './dist'


rollupFiles({
    fns: 'WDwdataTweq.mjs',
    fdSrc,
    fdTar,
    // nameDistType: 'kebabCase',
    hookNameDist: () => {
        return 'w-dwdata-tweq'
    },
    globals: {
        'path': 'path',
        'fs': 'fs',
        'crypto': 'crypto',
        'events': 'events',
        'chokidar': 'chokidar',
        'sharp': 'sharp',
    },
    external: [
        'path',
        'fs',
        'crypto',
        'events',
        'chokidar',
        'sharp',
    ],
})

