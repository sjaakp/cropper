import {version} from '../package.json';

export default {
    date: `${(new Date()).toISOString().slice(0,10)}`,
    version: version
}

