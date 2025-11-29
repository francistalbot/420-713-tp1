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
});

const userFormSchema = userSchema.extend({
    password: z.string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
        .max(100, { message: "Le mot de passe ne doit pas dépasser 100 caractères." })
        .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
        .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." })
        .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre." })
        .regex(/[^A-Za-z0-9]/, { message: "Le mot de passe doit contenir au moins un caractère spécial." }),
}).omit({uid: true});

const userUpdateSchema = userSchema.pick({
    email: true,
    firstName: true,
    lastName: true,
});

export type User = z.infer<typeof userSchema>;
export type UserForm = z.infer<typeof userFormSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export { userFormSchema, userSchema, userUpdateSchema };

