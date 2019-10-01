export class User {

    public static MIN_DISPLAYNAME_LEN: number = 4;

    // loosely validates email and displayName must be at least 4 characters
    public static validUser(user: User): boolean {
        if (user.displayName === undefined || user.displayName === null || user.displayName.length < this.MIN_DISPLAYNAME_LEN) {
            console.log(user.displayName);
            console.log('bas usr');
            return false;
        }
        return this.emailEx.test(user.email);
    }

    private static emailEx: RegExp = /[\w.\d]+@\w+\.\w{2,3}/;
    public displayName: string;
    public email: string;
    public _id: string;

    constructor(displayName: string, email: string) {
        this.displayName = displayName;
        this.email = email;
    }
}
