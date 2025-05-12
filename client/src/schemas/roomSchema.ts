// // src/schemas/roomSchema.ts
// import { z } from "zod";

// export const roomSchema = z.object({
//     name: z.string().min(3, "Le nom du salon doit comporter au moins 3 caractères."),
//     description: z.string().min(10, "La description doit comporter au moins 10 caractères."),
//     picture: z
//         .any()
//         .refine(
//             (files) => files instanceof FileList && files.length > 0,
//             "Une image doit être sélectionnée."
//         )
//         .transform((files) => files[0])
// });

// export type RoomFormData = z.infer<typeof roomSchema>;
