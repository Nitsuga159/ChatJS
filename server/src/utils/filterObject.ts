export default (object: Object, ...keys: string[]): void => {
    for(let key of keys) {
        delete object[key]
    }   
}