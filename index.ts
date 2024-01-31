import { z } from "zod";

const postSchema = z.array(
  z.object({
    id: z.string().uuid(),
    title: z.string().max(255),
    views: z.number().int().positive(),
  })
);

export type Post = z.infer<typeof postSchema>;

// zod parse vs safeParse
// parse: throws an error if invalid
// safeParse: returns a result object with a success boolean

function assertIsValidPost(data: unknown): asserts data is Post {
  const result = postSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid post: ${result.error.errors[0].message}`);
  }
}

const run = async () => {
  const BASE_URL = new URL("http://localhost:3000");
  BASE_URL.pathname = "/posts";
  // BASE_URL.searchParams.set('id', '6b3b3581-f6dd-4126-a2ae-2fef0b084640')

  const response = await fetch(BASE_URL);
  const data = await response.json();
  assertIsValidPost(data);
  // postSchema.parse(data)
  console.log(data);
};

run();
