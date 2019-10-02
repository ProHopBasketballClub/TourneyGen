export class User {

    public static MIN_DISPLAYNAME_LEN: number = 4;

    // displayName must be at least 4 characters
    public static validUser(user: User): boolean {
        return (user.displayName && user.displayName.length > this.MIN_DISPLAYNAME_LEN);

    }

    public displayName: string;
    public email: string;
    public _id: string;

    constructor(displayName: string, email: string) {
        this.displayName = displayName;
        this.email = email;
    }
}
