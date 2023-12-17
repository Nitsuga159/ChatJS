export default class ServerLogger {
    constructor(className: string) {
        this.className = className
    }

    private log(message: string, type: string, error?: Error) {
        console[type](`[${this.className}] >> ${message}`)

        error && console.error(error)
    }

    debug(message: string) { this.log(message, 'log') }
    info(message: string) { this.log(message, 'info') }
    error(message: string, e: Error) { this.log(message, 'error', e) }

    private className: string
}