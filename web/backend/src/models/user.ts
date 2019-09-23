

export class User {
    public displayName:string;
    public email:string;
    public _id:string;

    constructor(displayName:string,email:string){
        this.displayName = displayName;
        this.email = email;
    }
}