import { act, renderHook } from "@testing-library/react";
import { useIbanValidation } from "../useIbanValidation";

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("useIbanValidation", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useIbanValidation());

    expect(result.current.isValidating).toBe(false);
    expect(result.current.validationResult).toBe(null);
    expect(typeof result.current.validateIban).toBe("function");
  });

  it("should handle invalid IBAN", async () => {
    const mockResponse = { valid: false };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useIbanValidation());

    let validationResult: boolean;
    await act(async () => {
      validationResult = await result.current.validateIban("INVALID_IBAN");
    });

    expect(validationResult!).toBe(false);
    expect(result.current.validationResult).toBe(false);
    expect(result.current.isValidating).toBe(false);
  });
});
