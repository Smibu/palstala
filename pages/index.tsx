import { Button } from "@material-ui/core";
import { Layout } from "../src/Layout";
import AddIcon from "@material-ui/icons/Add";
import { TopicList } from "../src/TopicList";
import Link from "../src/Link";
import { GetServerSideProps } from "next";
import { PrismaClient, Topic } from "@prisma/client";
import React from "react";

const TopicsPage: React.FC<{ topics: Topic[] }> = (props) => (
  <Layout>
    <TopicList topics={props.topics} />
    <Link href="/topics/new">
      <Button startIcon={<AddIcon />} variant="contained">
        New topic
      </Button>
    </Link>
  </Layout>
);
export default TopicsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();
  const topics = await prisma.topic.findMany();
  return {
    props: { topics },
  };
};
