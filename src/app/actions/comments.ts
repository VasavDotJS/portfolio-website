'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const commentSchema = z.object({
  postId: z.string(),
  authorName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  authorEmail: z.string().email({ message: 'Please enter a valid email address.' }),
  content: z.string().min(4, { message: 'Comment must be at least 4 characters.' }),
});

export type CommentFormState = {
  success: boolean;
  message: string;
  errors?: {
    authorName?: string[];
    authorEmail?: string[];
    content?: string[];
  };
};

export async function submitComment(
  prevState: unknown,
  formData: FormData
): Promise<CommentFormState> {
  const postId = formData.get('postId') as string;
  const authorName = formData.get('authorName') as string;
  const authorEmail = formData.get('authorEmail') as string;
  const content = formData.get('content') as string;

  const result = commentSchema.safeParse({ postId, authorName, authorEmail, content });

  if (!result.success) {
    return {
      success: false,
      message: 'Failed to queue comment. Check inputs.',
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.comment.create({
      data: {
        postId,
        authorName,
        authorEmail,
        content,
        approved: false, // Must be approved by Vasav from the Admin Panel
      },
    });

    return {
      success: true,
      message: 'Comment submitted successfully. Awaiting admin review.',
    };
  } catch (error) {
    console.error('Failed to create comment:', error);
    return {
      success: false,
      message: 'Database error. Transmission failed.',
    };
  }
}
