export class DataReturnDTO {
    public valid: boolean;
    public data: any;

    constructor(valid: boolean,data: any) {
        this.valid = valid;
        this.data = data;
    }

}
