import { z } from 'zod';

const loginFormSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6).max(20),
});

const personalInfoSchema = z.object({
    firstName: z.string().min(2).max(20),
    lastName: z.string().min(2).max(20),
    age: z.number().int().positive(),
});

type LoginForm = z.infer<typeof loginFormSchema>;

/**
 * this hook returns an object with onSubmit function which validates the input of the form according to a schema. This hook avoids the need to repeat all the validation logic in every form
 * @param schema the schema to validate the form
 * @param onSubmit the function to be called when the form is submitted
 * @returns an object with onSubmit function
 */
const useForm = <TValues>(
    schema: z.Schema<TValues>,
    handleFormSubmit: (value: TValues) => void) => {

    return {
        onSubmit: (value: unknown) => {
            const result = schema.safeParse(value);
            if (!result.success) {
                throw new Error(`Invalid post: ${result.error.errors[0].message}`)

            }

            // call the handleFormSubmit on the successfully parsed value
            handleFormSubmit(result.data);
        }
    }
}

const loginInput = {
    username: 'brave@gmail.com',
    password: '1234567890'
}

// the handleSubmit function I passed to the useForm hook is always going to be called with a `valid` value
const form = useForm(loginFormSchema, (value) => console.log(value))
form.onSubmit(loginInput)
