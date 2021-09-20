export const Constants = {
    linux: function () {
        return process.platform === 'linux'
    },
    macOS() {
        return process.platform === 'darwin';
    },
    windows() {
        return process.platform === 'win32'
    },
    production: function () {
        return process.env.NODE_ENV !== 'development';
    },
    dev: function () {
        return process.env.NODE_ENV === 'development';
    },
}