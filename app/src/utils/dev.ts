class Dev {
    wait(seconds: number) {
        return new Promise((r) => setTimeout(() => r(1), seconds * 1000));
    }
}

export default Dev