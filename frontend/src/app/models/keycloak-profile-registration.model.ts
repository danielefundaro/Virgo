export class KeycloakProfileRegistration {
	username!: string;
	email!: string;
	firstName!: string;
	lastName!: string;
    password!: string;
	totp?: boolean;

    constructor(email: string, firstName: string, lastName: string, username: string, password: string) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
    }
}