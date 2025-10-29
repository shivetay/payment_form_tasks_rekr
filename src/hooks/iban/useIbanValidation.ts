import { useCallback, useState } from "react";

export const useIbanValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(
    null,
  );

  const validateIban = useCallback(async (iban: string): Promise<boolean> => {
    if (!iban) return false;

    setIsValidating(true);
    try {
      const response = await fetch(`https://matavi.eu/validate/?iban=${iban}`);
      const data = await response.json();
      const isValid = data.valid === true;
      setValidationResult(isValid);
      return isValid;
    } catch (error) {
      console.error("IBAN validation error:", error);
      setValidationResult(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    validateIban,
    isValidating,
    validationResult,
  };
};

export default useIbanValidation;
