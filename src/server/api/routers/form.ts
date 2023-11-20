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
    .input(z.object({ userId: z.string().min(1) }))
    .query(({ ctx,input }) => {
      return ctx.db.form.findMany({
        orderBy: { createdAt: "desc" },
        where: { userId: input.userId },
      });
    }),
    getFormById: protectedProcedure
    .input(z.object({ formId: z.string().min(1) }))
    .query(({ ctx,input }) => {
      
      return ctx.db.form.findUnique({
        where: { id: input.formId },
        include: {
          formQuestions: {
            include: {
              question: {
                include: {
                  responses: {
                    where: { formId: input.formId },
                  },
                },
              },
            },
          },
        },
      });
    }),
  
  
    deleteForm: protectedProcedure
    .input(z.object({ formId: z.string().min(1) }))
    .mutation(({ ctx,input }) => {
      return ctx.db.form.delete({
        where: { id: input.formId },
      });
    }),
createForm: protectedProcedure
  .input(z.object({ title: z.string().min(1), description: z.string(), userId: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {
    try {
      const newForm = await ctx.db.form.create({
        data: {
          title: input.title,
          description: input.description,
          userId: input.userId,
         
        },
      });

      const questions = await ctx.db.question.findMany({ where:{
        isDefault:true,
      },select: { id: true } });

      const formQuestions = questions.map(question => ({
        formId: newForm.id,
        questionId: question.id,
      }));
      
      await ctx.db.formQuestion.createMany({
        data: formQuestions,
      });
      const formResponseQuestions = questions.map(question => ({
        formId: newForm.id,
        questionId: question.id,
        userId: input.userId,
        responseValue:{responseValue:""}
      }));
       await ctx.db.response.createMany({data:formResponseQuestions});

      return newForm;
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  }),
  updateForm: protectedProcedure
  .input(z.object({
    formId: z.string(),
    responses: z.array(z.object({
      questionId: z.string(),
      responseValue: z.any(),
    })),
  }))
  .mutation(async ({ ctx, input }) => {
    const { formId, responses } = input;
    console.log(formId)
    const form = await ctx.db.form.findUnique({
      where: { id: formId },
      include: {
        formQuestions: {
          include: {
            question: {
              include: {
                responses: true,
              },
            },
          },
        },
      },
    });

    if (!form) {
      throw new Error('Form not found');
    }
    console.log(form)
    const updatedResponses = await Promise.all(responses.map(async (response) => {
      const formQuestion = form.formQuestions.find(fq => fq.questionId === response.questionId);
      if (formQuestion && formQuestion.question.responses && formQuestion.question.responses[0]) {
        const responseToUpdate = await ctx.db.response.findFirst({
          where: { 
            formId: formId, 
            questionId: response.questionId 
          }
        });
        if (responseToUpdate) {
          return ctx.db.response.update({
            where: { id: responseToUpdate.id },
            data: { responseValue: {responseValue:response.responseValue} },
          });
        }
      }
    }));
    

    return { form, updatedResponses };
  }),


    getSecretMessage: protectedProcedure.query(() => {
      return "you can now see this secret message!";
    }),
    
  });