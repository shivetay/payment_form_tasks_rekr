import { paymentFormSchema } from "../payment-form/payment-form";

describe("paymentFormSchema", () => {
  describe("amount validation", () => {
    it("should accept valid amount", () => {
      const validData = {
        amount: 100.5,
        payeeAccount: "LT307300010172619164",
        purpose: "Test payment",
        payerAccount: "1",
        payee: "John Doe",
      };

      const result = paymentFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject amount less than 0.01", () => {
      const invalidData = {
        amount: 0.005,
        payeeAccount: "LT307300010172619164",
        purpose: "Test payment",
        payerAccount: "1",
        payee: "John Doe",
      };

      const result = paymentFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Amount must be at least 0.01",
        );
      }
    });
  });
});
