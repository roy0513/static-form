import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


// Access user ID
export const formRouter = createTRPCRouter({
    hello: publicProcedure
      .input(z.object({ text: z.string() }))
      .query(({ input }) => {
        return {
          greeting: `Hello ${input.text}`,
        };
      }),
  
  
    getForm: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx,input }) => {
      return ctx.db.form.findMany({
        orderBy: { createdAt: "desc" },
        where: { userId: input.userId },
      });
    }),
  
    getSecretMessage: protectedProcedure.query(() => {
      return "you can now see this secret message!";
    }),
  });