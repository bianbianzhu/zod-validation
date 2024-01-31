import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { z } from "zod";

const PORT = process.env.PORT || 3002;

const querySchema = z.object({
  index: z.string().max(1),
});

const startServer = () => {
  const app = express();

  app
    .listen(PORT, () => {
      console.log(`listening to PROT ${PORT}`);
      return;
    })
    .on("error", (err) => {
      console.log(err);
      process.exit(1);
    });

  return app;
};

const makeGetEndpoint =
  <T>(
    schema: z.Schema<T>,
    cb: (req: Request<any, any, any, T>, res: Response) => void
  ) =>
  (req: Request, res: Response) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).send(`Wrong query: ${result.error.errors[0].message}`);
      return;
    }

    cb(req as any, res);
    return;
  };

const bookHandler = makeGetEndpoint(querySchema, (req, res) => {
  const { index } = req.query;
  res.status(200).send(`The request query index is ${index}`);
  return;
});

const expressLoader = () => {
  const app = startServer();

  app.get("/books", bookHandler);
};

expressLoader();
