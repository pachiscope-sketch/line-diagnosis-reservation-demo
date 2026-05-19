import { z } from "zod";
import { demoTypes } from "@/lib/types";

const demoTypeSchema = z.enum(demoTypes);

export const diagnosisRecordSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  lineUserId: z.string().min(1),
  lineDisplayName: z.string().min(1),
  sourceDemoType: demoTypeSchema,
  recommendedPlan: z.string().min(1),
  answers: z.object({
    demoType: demoTypeSchema,
    industry: z.string().min(1),
    issue: z.string().min(1),
    goal: z.string().min(1),
    selectedFeatures: z.array(z.string().min(1)).default([])
  })
});

export const reservationRecordSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  diagnosisId: z.string().optional(),
  sourceDemoType: demoTypeSchema,
  lineUserId: z.string().min(1),
  lineDisplayName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  preferredDateTime: z.string().min(1),
  consultation: z.string().min(1),
  industry: z.string().optional(),
  goal: z.string().optional()
});

export const notifyPayloadSchema = z
  .object({
    type: z.enum(["diagnosis", "reservation", "member", "test"]).optional(),
    title: z.string().min(1).optional(),
    message: z.string().min(1).optional(),
    data: z
      .object({
        name: z.string().optional(),
        email: z.string().optional(),
        industry: z.string().optional(),
        goal: z.string().optional(),
        preferredDateTime: z.string().optional(),
        consultation: z.string().optional(),
        lineDisplayName: z.string().optional(),
        lineUserId: z.string().optional(),
        sourceDemoLabel: z.string().optional(),
        sourceDemoType: z.string().optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();
