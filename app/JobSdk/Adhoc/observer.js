import CrashJob from "./crash";

class AdhocObserver {
    constructor() {}

    execute = (status, details) => {
        switch (status) {
            case "crash":
                return new CrashJob(details);
        }
    };
}

export default new AdhocObserver();
