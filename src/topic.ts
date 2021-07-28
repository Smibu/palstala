import { Role } from "@prisma/client";
import prisma from "./client";
import { isApprovedRole, isModOrAdmin } from "./roles";

export async function getTopicWithVisiblePosts(
  topicId: string,
  currUser: { id: string; role: Role } | undefined
) {
  const whereClause = isModOrAdmin(currUser?.role ?? Role.USER)
    ? {}
    : {
        author: {
          OR: [
            { role: Role.USER },
            { role: Role.MODERATOR },
            { role: Role.ADMIN },
            { id: currUser?.id },
          ],
        },
      };
  return await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      posts: {
        where: whereClause,
        orderBy: {
          createdAt: "asc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
}

export async function getVisibleTopics(
  currUser: { id: string; role: Role } | undefined
) {
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      title: true,
      posts: {
        select: {
          authorId: true,
          author: {
            select: {
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  return topics.filter((t) => {
    const firstPost = t.posts[0];
    return (
      isApprovedRole(firstPost.author.role) ||
      isModOrAdmin(currUser?.role ?? Role.USER) ||
      firstPost.authorId === currUser?.id
    );
  });
}
