import { z } from 'zod';

const userSchema = z.object({
    uid: z.string(),
    firstName: z.string()
        .min(2, { message: "Le prénom doit contenir au moins 2 caractères." })
        .max(100, { message: "Le prénom ne doit pas dépasser 100 caractères." }),
    lastName: z.string()
        .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
        .max(100, { message: "Le nom ne doit pas dépasser 100 caractères." }),
    email: z.email({ message: "L'adresse courriel n'est pas valide." }),
    darkTheme: z.boolean().optional(),
});

const userFormSchema = userSchema.extend({
    password: z.string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
        .max(100, { message: "Le mot de passe ne doit pas dépasser 100 caractères." })
        .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
        .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." })
        .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre." })
        .regex(/[^A-Za-z0-9]/, { message: "Le mot de passe doit contenir au moins un caractère spécial." }),
    confirmPassword: z.string()
        .min(1, { message: "La confirmation du mot de passe est requise." }),
}).omit({uid: true, darkTheme: true});

const userSigninSchema = userSchema.pick({email: true}).extend({password: z.string().min(1, { message: "Le mot de passe est requis." })});

const userUpdateSchema = userSchema.pick({
    email: true,
    firstName: true,
    lastName: true,
});



export type User = z.infer<typeof userSchema>;
export type UserForm = z.infer<typeof userFormSchema>;
export type UserSignin = z.infer<typeof userSigninSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

// Type pour contenir les messages d'erreur de chaque champ de UserForm et les valeurs initiales des formulaires
export type UserFormErrors = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};
export type UserSigninErrors = {
    email?: string;
    password?: string;
};
export const initialUserSignin: UserSignin = {
    email: "",
    password: "",
};
export const initialUserForm: UserForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export { userFormSchema, userSchema, userSigninSchema, userUpdateSchema };

