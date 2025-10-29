"use client";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import "./form.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useIbanValidation } from "@/hooks";
import { paymentFormSchema } from "@/schemas";
import { type PayerAccount, payerAccounts } from "./data";

const FORM_FIELDS = [
  {
    label: "Amount",
    name: "amount",
    type: "number",
    required: true,
    validation: {
      min: 0.01,
      max: "accountBalance",
    },
  },
  {
    label: "Payee Account (IBAN)",
    name: "payeeAccount",
    type: "text",
    required: true,
    validation: {
      iban: true,
    },
  },
  {
    label: "Purpose",
    name: "purpose",
    type: "text",
    required: true,
    validation: {
      minLength: 3,
      maxLength: 135,
    },
  },
  {
    label: "Payer Account",
    name: "payerAccount",
    type: "select",
    required: true,
    options: "payerAccounts",
  },
  {
    label: "Payee",
    name: "payee",
    type: "text",
    required: true,
    validation: {
      maxLength: 70,
    },
  },
];

type FormFields =
  | "amount"
  | "payeeAccount"
  | "purpose"
  | "payerAccount"
  | "payee";

type FormData = {
  amount: number;
  payeeAccount: string;
  purpose: string;
  payerAccount: string;
  payee: string;
};

export function FormComponent() {
  const [selectedPayerAccount, setSelectedPayerAccount] =
    useState<PayerAccount | null>(null);
  const { validateIban, isValidating, validationResult } = useIbanValidation();

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: 0,
      payeeAccount: "LT307300010172619164",
      purpose: "",
      payerAccount: "",
      payee: "",
    },
  });

  const watchedPayerAccount = watch("payerAccount");
  const watchedPayeeAccount = watch("payeeAccount");

  useEffect(() => {
    const account = payerAccounts.find((acc) => acc.id === watchedPayerAccount);
    setSelectedPayerAccount(account || null);
  }, [watchedPayerAccount]);

  useEffect(() => {
    if (watchedPayeeAccount) {
      validateIban(watchedPayeeAccount);
    }
  }, [watchedPayeeAccount, validateIban]);

  useEffect(() => {
    if (selectedPayerAccount) {
      setValue(
        "amount",
        Math.min(watch("amount") || 0, selectedPayerAccount.balance),
      );
    }
  }, [selectedPayerAccount, setValue, watch]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form submitted:", data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="form-container"
    >
      <FormControl
        margin="normal"
        error={!!errors.amount}
        sx={{ margin: "2rem 2rem" }}
      >
        <InputLabel htmlFor="amount">Amount *</InputLabel>
        <Input
          id="amount"
          type="number"
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <FormHelperText>{errors.amount.message}</FormHelperText>
        )}
        {selectedPayerAccount && (
          <FormHelperText>
            Available balance: {selectedPayerAccount.balance.toFixed(2)} EUR
          </FormHelperText>
        )}
      </FormControl>

      <FormControl
        margin="normal"
        error={!!errors.payeeAccount}
        sx={{ margin: "2rem 2rem" }}
      >
        <InputLabel htmlFor="payeeAccount">Payee Account (IBAN) *</InputLabel>
        <Input id="payeeAccount" {...register("payeeAccount")} />
        {errors.payeeAccount && (
          <FormHelperText>{errors.payeeAccount.message}</FormHelperText>
        )}
        {validationResult !== null && !isValidating && (
          <FormHelperText color={validationResult ? "success" : "error"}>
            {validationResult ? "Valid IBAN" : "Invalid IBAN"}
          </FormHelperText>
        )}
      </FormControl>

      {/* Purpose Field */}
      <FormControl
        margin="normal"
        error={!!errors.purpose}
        sx={{ margin: "2rem 2rem" }}
      >
        <InputLabel htmlFor="purpose">Purpose *</InputLabel>
        <Input id="purpose" {...register("purpose")} />
        {errors.purpose && (
          <FormHelperText>{errors.purpose.message}</FormHelperText>
        )}
        <FormHelperText>
          {watch("purpose")?.length || 0}/135 characters
        </FormHelperText>
      </FormControl>

      <FormControl
        margin="normal"
        error={!!errors.payerAccount}
        sx={{ margin: "2rem 2rem" }}
      >
        <InputLabel htmlFor="payerAccount">Payer Account *</InputLabel>
        <Controller
          name="payerAccount"
          control={control}
          render={({ field }) => (
            <Select {...field} id="payerAccount" label="Payer Account *">
              {payerAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.iban} - {account.balance.toFixed(2)} EUR
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.payerAccount && (
          <FormHelperText>{errors.payerAccount.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        margin="normal"
        error={!!errors.payee}
        sx={{ margin: "2rem 2rem" }}
      >
        <InputLabel htmlFor="payee">Payee *</InputLabel>
        <Input id="payee" {...register("payee")} />
        {errors.payee && (
          <FormHelperText>{errors.payee.message}</FormHelperText>
        )}
        <FormHelperText>
          {watch("payee")?.length || 0}/70 characters
        </FormHelperText>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ margin: "2rem 2rem" }}
      >
        {isSubmitting ? "Processing..." : "Submit Payment"}
      </Button>
    </Box>
  );
}
