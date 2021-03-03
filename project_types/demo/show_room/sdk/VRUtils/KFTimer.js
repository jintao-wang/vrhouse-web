export class KFTimer {
    static async wait(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }
}