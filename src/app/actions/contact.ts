'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export type FormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContact(prevState: unknown, formData: FormData): Promise<FormState> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  const result = contactSchema.safeParse({ name, email, message });

  if (!result.success) {
    const formattedErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: 'Transmission failed. Please resolve input anomalies.',
      errors: formattedErrors,
    };
  }

  // Success telemetry logging
  console.log('📡 [NEW CONTACT TELEMETRY RECEIVED]:');
  console.log(`👤 Name: ${name}`);
  console.log(`✉️ Email: ${email}`);
  console.log(`💬 Message: ${message}`);

  return {
    success: true,
    message: 'Telemetry transmitted successfully. Signal received, Vasav.',
  };
}
