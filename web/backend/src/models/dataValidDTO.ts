export class DataValidDTO {
    public error: string;
    public valid: boolean;

    constructor(valid: boolean, error: string) {
        this.error = error;
        this.valid = valid;
    }
}
