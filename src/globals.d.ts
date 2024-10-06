
declare module "@paystack/inline-js" {
  export default class PaystackPop {
    constructor(options?: { onCancel?(): void });
    public newTransaction(options: {
      key: string;
      reference: string;
      amount: string;
      email: string;
      onCancel?: () => void;
      onError?: (e: unknown) => void;
      onSuccess?: () => void;
    }): void
  }
}
