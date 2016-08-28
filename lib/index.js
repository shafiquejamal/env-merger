const fs = require('fs');
const path = require('path');
const properties = require('properties');

class Config {
    constructor({ dir = 'env', mergeProcess = true } = {}) {
        this.dir = dir;
        this.mergeProcess = mergeProcess;
        
        return this.getEnv(this.filenames);
    }

    get filenames() {
        // Order matters: overrides occur starting from first
        return [
            'default.env',
            `${this.currentEnv}.env`,
            'local.env',
        ];
    }

    get currentEnv() {
        return process.env.NODE_ENV == null ? 'production' : process.env.NODE_ENV;
    }

    getEnv(filenames) {
        const paths = filenames.map(filename => File.path(this.dir, filename))
        let parsed = Object.assign({}, ...this.parse(paths));

        if (this.mergeProcess) {
            parsed = Object.assign(process.env, parsed);
        }

        return parsed;
    }

    parse(paths) {
        return paths
            .filter(File.exists)
            .map(File.get)
            .map(File.parse);
    }
}

class File {
    static path(...parts) {
        return path.join(process.cwd(), ...parts);
    }

    static exists(filename) {
        let exists = false;
        try {
            const stat = fs.statSync(filename);
            if (stat != null && stat.size > 0) {
                exists = true;
            }
        } catch(ex) {}

        return exists;
    }

    static get(filename) {
        return fs.readFileSync(filename, 'UTF-8');
    }

    static parse(contents) {
        return properties.parse(contents);
    }
}

const factory = (params => {
    return new Config(params);
});

module.exports = factory;
