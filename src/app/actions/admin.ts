'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper helper to verify active session
async function verifySession() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error('UNAUTHORIZED_ACTION: Valid administrator token required.');
  }
}

// 1. UPDATE SYSTEM STATUS
export async function updateSystemStatus(
  statusText: string,
  location: string,
  availability: string
) {
  await verifySession();

  try {
    const existing = await prisma.systemStatus.findFirst();

    if (existing) {
      await prisma.systemStatus.update({
        where: { id: existing.id },
        data: { statusText, location, availability },
      });
    } else {
      await prisma.systemStatus.create({
        data: { statusText, location, availability },
      });
    }

    revalidatePath('/');
    return { success: true, message: 'System status updated successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Database transaction failed.' };
  }
}

// 2. UPDATE CURRENTLY LISTENING TRACK
export async function updateListeningTrack(
  trackName: string,
  artistName: string,
  albumName: string,
  artworkUrl: string,
  mood: string,
  notes: string
) {
  await verifySession();

  try {
    // Deactivate previous active tracks
    await prisma.musicEntry.updateMany({
      data: { active: false },
    });

    await prisma.musicEntry.create({
      data: {
        trackName,
        artistName,
        albumName,
        artworkUrl,
        mood,
        notes,
        active: true,
      },
    });

    revalidatePath('/');
    return { success: true, message: 'Currently listening track updated.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update listening track.' };
  }
}

// 3. CREATE OR UPDATE PROJECT
export async function upsertProject(
  id: string | null,
  data: {
    title: string;
    description: string;
    stack: string;
    liveLink?: string | null;
    githubLink?: string | null;
    imageUrl: string;
    featured: boolean;
  }
) {
  await verifySession();

  try {
    if (id) {
      // Update
      await prisma.project.update({
        where: { id },
        data,
      });
    } else {
      // Create
      const count = await prisma.project.count();
      await prisma.project.create({
        data: {
          ...data,
          order: count + 1,
        },
      });
    }

    revalidatePath('/');
    return { success: true, message: 'Showcase project synchronized.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to synchronize project.' };
  }
}

// 4. DELETE PROJECT
export async function deleteProject(id: string) {
  await verifySession();

  try {
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath('/');
    return { success: true, message: 'Project deleted successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete project.' };
  }
}

// 5. CREATE OR UPDATE BLOG POST
export async function upsertBlogPost(
  id: string | null,
  data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string;
    category: string;
    published: boolean;
    readingTime: number;
  }
) {
  await verifySession();

  try {
    if (id) {
      await prisma.blogPost.update({
        where: { id },
        data,
      });
    } else {
      await prisma.blogPost.create({
        data,
      });
    }

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${data.slug}`);
    return { success: true, message: 'Blog post published/updated.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to synchronize blog post.' };
  }
}

// 6. DELETE BLOG POST
export async function deleteBlogPost(id: string) {
  await verifySession();

  try {
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath('/blog');
    return { success: true, message: 'Article deleted successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete article.' };
  }
}

// 7. COMMENT WORKFLOWS (APPROVE / DELETE)
export async function approveComment(id: string) {
  await verifySession();

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { approved: true },
      include: { post: true },
    });

    revalidatePath(`/blog/${comment.post.slug}`);
    return { success: true, message: 'Comment approved and active.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to approve comment.' };
  }
}

export async function deleteComment(id: string) {
  await verifySession();

  try {
    await prisma.comment.delete({
      where: { id },
    });

    return { success: true, message: 'Comment deleted from archive.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete comment.' };
  }
}
