
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import AppCredentialsSection from "./AppCredentialsSection";
import FormFieldGroup from "./FormFieldGroup";
import FormSubmitButton from "./FormSubmitButton";

// Schema definition
const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  callback_url: z.string().url("Must be a valid URL starting with https://"),
  consumer_key: z.string().min(1, "Consumer key is required"),
  consumer_secret: z.string().min(1, "Consumer secret is required"),
  business_short_code: z.string().min(1, "Business short code is required"),
  passkey: z.string().min(1, "Passkey is required"),
  bearer_token: z.string().min(1, "Bearer token is required"),
  party_a: z.string().min(1, "Party A is required"),
  party_b: z.string().min(1, "Party B is required"),
  originator_conversation_id: z.string().optional(),
  initiator_name: z.string().optional(),
  initiator_password: z.string().optional(),
  security_credential: z.string().optional(),
  command_id: z.enum(['SalaryPayment', 'BusinessPayment', 'PromotionPayment']).optional(),
  queue_timeout_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  result_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  transaction_type: z.enum(['CustomerBuyGoodsOnline', 'CustomerPayBillOnline']),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormValues) => void;
  defaultValues?: Partial<ApplicationFormValues>;
  isEditing?: boolean;
  isSubmitting?: boolean;
  appCredentials?: {
    app_id?: string;
    app_secret?: string;
  };
}

const ApplicationForm = ({
  onSubmit,
  defaultValues,
  isEditing = false,
  isSubmitting = false,
  appCredentials,
}: ApplicationFormProps) => {
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultValues || {
      name: "",
      callback_url: "",
      consumer_key: "",
      consumer_secret: "",
      business_short_code: "",
      passkey: "",
      bearer_token: "",
      party_a: "",
      party_b: "",
      originator_conversation_id: "",
      initiator_name: "",
      initiator_password: "",
      security_credential: "",
      command_id: undefined,
      queue_timeout_url: "",
      result_url: "",
      transaction_type: "CustomerPayBillOnline",
    },
  });

  // Function to handle form submission
  const handleSubmit = (data: ApplicationFormValues) => {
    // Only submit if not already submitting
    if (!isSubmitting) {
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="name"
            label="App Name"
            placeholder="My App"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="callback_url"
            label="Callback URL"
            placeholder="https://example.com/callback"
            description="Must start with https://"
            disabled={isSubmitting}
          />
          <div className="space-y-2">
            <label htmlFor="transaction_type" className="text-sm font-medium">
              Transaction Type
            </label>
            <select
              id="transaction_type"
              {...form.register("transaction_type")}
              disabled={isSubmitting}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="CustomerPayBillOnline">Customer Pay Bill Online</option>
              <option value="CustomerBuyGoodsOnline">Customer Buy Goods Online</option>
            </select>
            {form.formState.errors.transaction_type && (
              <p className="text-sm text-destructive">
                {form.formState.errors.transaction_type.message}
              </p>
            )}
          </div>
        </div>

        {/* App credentials section - only shown when editing */}
        {isEditing && appCredentials && (
          <AppCredentialsSection 
            appId={appCredentials.app_id} 
            appSecret={appCredentials.app_secret} 
          />
        )}

        {/* Consumer Keys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="consumer_key"
            label="Consumer Key"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="consumer_secret"
            label="Consumer Secret"
            disabled={isSubmitting}
          />
        </div>

        {/* Business Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="business_short_code"
            label="Business Short Code"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="passkey"
            label="Passkey"
            disabled={isSubmitting}
          />
        </div>

        {/* Bearer Token */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <FormFieldGroup
            form={form}
            name="bearer_token"
            label="Bearer Token"
            disabled={isSubmitting}
          />
        </div>

        {/* Party Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="party_a"
            label="Party A"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="party_b"
            label="Party B"
            disabled={isSubmitting}
          />
        </div>

        {/* Additional M-Pesa Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="originator_conversation_id"
            label="Originator Conversation ID"
            placeholder="Optional"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="initiator_name"
            label="Initiator Name"
            placeholder="Optional"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="initiator_password"
            label="Initiator Password"
            placeholder="Optional"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="security_credential"
            label="Security Credential"
            placeholder="Optional"
            disabled={isSubmitting}
          />
          <div className="space-y-2">
            <label htmlFor="command_id" className="text-sm font-medium">
              Command ID
            </label>
            <select
              id="command_id"
              {...form.register("command_id")}
              disabled={isSubmitting}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Command ID</option>
              <option value="SalaryPayment">Salary Payment</option>
              <option value="BusinessPayment">Business Payment</option>
              <option value="PromotionPayment">Promotion Payment</option>
            </select>
            {form.formState.errors.command_id && (
              <p className="text-sm text-destructive">
                {form.formState.errors.command_id.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldGroup
            form={form}
            name="queue_timeout_url"
            label="Queue Timeout URL"
            placeholder="https://example.com/timeout"
            description="Optional callback URL for timeout"
            disabled={isSubmitting}
          />
          <FormFieldGroup
            form={form}
            name="result_url"
            label="Result URL"
            placeholder="https://example.com/result"
            description="Optional callback URL for results"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center pt-4">
          <FormSubmitButton 
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />
        </div>
      </form>
    </Form>
  );
};

export default ApplicationForm;
