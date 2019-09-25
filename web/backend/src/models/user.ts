

export class User {
    private static emailEx: RegExp = /[\w\d]+@\w+\.\w{2,3}/g;
    public displayName:string;
    public email:string;
    public _id:string;

    constructor(displayName:string,email:string){
        this.displayName = displayName;
        this.email = email;
    }

    //loosely validates email and displayName must be at least 4 characters
    public static validUser(user: User): boolean {
        if (user.displayName == null || user.displayName.length < 4) {
            return false;
        }
        return this.emailEx.test(user.email);
    }
}