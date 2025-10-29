import { z } from "zod";

export const paymentFormSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be at least 0.01")
    .max(1000000, "Amount exceeds maximum limit"),
  payeeAccount: z.string().min(1, "Payee account is required"),
  purpose: z
    .string()
    .min(3, "Purpose must be at least 3 characters")
    .max(135, "Purpose cannot exceed 135 characters"),
  payerAccount: z.string().min(1, "Payer account is required"),
  payee: z
    .string()
    .min(1, "Payee is required")
    .max(70, "Payee name cannot exceed 70 characters"),
});

export default paymentFormSchema;
