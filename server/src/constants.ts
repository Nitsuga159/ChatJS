const HEADERS = {
    X_TRANSACTION_ID: 'x-transaction-id'
}

const USER_TYPES = {
    USER_ID: '6583b0e7cee7f69cccb8edfd',
    ADMIN_ID: '6583b0dbcee7f69cccb8edfc',
    ROOT_ID: '6583b0accee7f69cccb8edfb'
}

export enum SCOPES {
    ROOT = 'root',
    ADMIN = 'admin',
    USER = 'user'
}

const CONSTANS = {
    SCOPES,
    HEADERS,
    USER_TYPES
}

export default CONSTANS