import type { MetadataRoute } from "next";
import { getAllPublishedDownloads } from "../lib/downloads";
import { getAllPublishedNotes } from "../lib/notes";
import { getAllPublishedProjects } from "../lib/projects";
import { getAllPublishedTopics } from "../lib/topics";

const baseUrl = "https://yoruming.cn";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/notes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/topics`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/downloads`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/resume`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/copyright`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllPublishedProjects().map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    changeFrequency: "monthly",
    priority: project.featured ? 0.9 : 0.7,
  }));

  const noteRoutes: MetadataRoute.Sitemap = getAllPublishedNotes().map((note) => ({
    url: `${baseUrl}/notes/${note.slug}`,
    lastModified: new Date(`${note.updatedAt}T00:00:00+08:00`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const topicRoutes: MetadataRoute.Sitemap = getAllPublishedTopics().map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const downloadRoutes: MetadataRoute.Sitemap = getAllPublishedDownloads().map((download) => ({
    url: `${baseUrl}/downloads/${download.slug}`,
    lastModified: new Date(`${download.updatedAt}T00:00:00+08:00`),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes, ...noteRoutes, ...topicRoutes, ...downloadRoutes];
}
