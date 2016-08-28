No-frills merging of environment-specific configuration files into process.env. Requires node 6+.

#### Usage:

Place your environment file(s) in a directory under your project called /config.

In /env/development.env:

```
# My environment values
foo=1
bar=2
```

In your node app (eg, index.js):

```
require('env-merger')();
process.env.foo; // 1
process.env.bar; // 2
```

The value of NODE_ENV determines which environment file to use. The following will use values in the file `development.env` ( If NODE_ENV is not set, assumes production environment and will attempt to load a file `production.env`)

```
NODE_ENV=development & node index.js
```

#### Files:

Values are loaded from environment files in the following order:

1. process.env
1. config/default.env
1. config/{NODE_ENV}.env
1. config/local.env

Files that don't exist are skipped. Each subsequent file will override values in the preceding file.

See the [properties](https://www.npmjs.com/package/properties) package for more info on file structure.

The local.env file is intended to contain overrides for local environments only -- this file is typically not committed to source control.

#### Options:

**dir**

default: 'env'

Specify directory to look in for environment files.

```
require('env-merger')({ dir: 'foobar' });
```

**mergeProcess**

default: true

* True: merges your environment values into process.env. 
* False: will not merge process.env. Returns an object containing only values from your own environment files:

    ```
    const env = require('env-merger')({ mergeProcess: false });
    env.foo; // 1
    env.bar; // 2
    ```
