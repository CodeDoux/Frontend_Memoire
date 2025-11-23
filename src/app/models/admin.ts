import { User } from "./user";

export class Admin {
    id! :number ;
    niveau!:number;
    role_label?:string;

    user!: User;
}
