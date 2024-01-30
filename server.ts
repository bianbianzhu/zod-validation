import dotenv from 'dotenv';
dotenv.config();
import express, { Request, RequestHandler, Response } from 'express';
import { z } from 'zod';

const PORT = process.env.PORT || 3001;

const requestQuerySchema = z.object({
    id: z.string().uuid(),
});


const makeGetEndpoint =
    <TQuery>(
        schema: z.Schema<TQuery>,
        cb: (req: Request<any, any, any, TQuery>, res: Response) => void
    ) => (req: Request, res: Response) => {
        // const id = req.query.id; // the type is currently: 
        // string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined

        const result = schema.safeParse(req.query);
        if (!result.success) {
            res.status(400).send(`Invalid query params: ${result.error.errors[0].message}`);
            return;
        }

        cb(req as any, res);
        return;

    };

const postHandler = makeGetEndpoint(requestQuerySchema, (req, res) => {
    const id = req.query.id

    res.status(200).send(`Post with id ${id} is requested`);
})

const startServer = () => {
    const app = express();

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

    app.get('/posts', postHandler)
}

startServer();






// /**
//  * this helper function creates a request handler which validates the query params based on the given schema
//  * @param schema the schema to validate the query params
//  * @param cb the callback function to execute if the query params are valid
//  * @returns a request handler
//  */
// const makeGetEndpoint = (schema: any, cb: any) => (req: any, res: any) => {
//     // check if the query params are valid
//     // if not, send a 400 response
//     // otherwise, execute the callback function
// }

// const postHandler = makeGetEndpoint(postSchema, (req: any, res: any) => {
//     //... res.status(200).send(`Post with id ${id} is requested`);
// })

// app.get('/posts', postHandler)