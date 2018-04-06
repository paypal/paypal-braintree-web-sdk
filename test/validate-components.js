/* @flow */

import { join } from 'path';

import { exists } from 'fs-extra';

import pkg from '../package.json';

const SDK_JS = '__sdk__.js';
const NODE_MODULES = 'node_modules';

const BABELRC_NAMES = [
    '.babelrc',
    '.babelrc.json',
    '.babelrc.js'
];

async function validateComponents() : Promise<void> {
    for (let dependencyName of Object.keys(pkg.dependencies)) {
        let dependencyPath = join(NODE_MODULES, dependencyName);

        if (!await exists(join(dependencyPath, SDK_JS))) {
            throw new Error(`Expected ${ dependencyName } to have ${ SDK_JS }`);
        }

        if (!await exists(join(dependencyPath, SDK_JS))) {
            throw new Error(`Expected ${ dependencyName } to have ${ SDK_JS }`);
        }

        // $FlowFixMe
        let componentMeta = require(join(dependencyName, SDK_JS)); // eslint-disable-line security/detect-non-literal-require

        if (!componentMeta.modules) {
            throw new Error(`Expected ${ dependencyName } ${ SDK_JS } to contain modules key`);
        }

        for (let babelrc of BABELRC_NAMES) {
            if (await exists(join(dependencyPath, babelrc))) {
                throw new Error(`Expected ${ dependencyName } to not contain ${ babelrc }`);
            }
        }

        // eslint-disable-next-line no-console
        console.log(`Validated ${ dependencyName }`);
    }
}

validateComponents().catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(1);
});
