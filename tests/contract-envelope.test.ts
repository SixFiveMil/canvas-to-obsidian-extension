import { describe, expect, it } from "vitest";
import type { CanvasSyncEnvelope, CanvasCoursePayload } from "../src/types";

describe("CanvasSyncEnvelope protocol v1 contract", () => {
  it("generates envelope adhering to v1 bridge schema", () => {
    const samplePayload: CanvasCoursePayload = {
      courseId: "12345",
      courseName: "CS101: Introduction to Computer Science",
      courseCode: "CS101",
      fetchedAt: new Date().toISOString(),
      modules: [
        {
          id: "1",
          name: "Module 1: Getting Started",
          position: 1,
          items: [
            {
              id: "101",
              title: "Welcome Page",
              type: "WikiPage",
              position: 1,
              pageSlug: "welcome"
            }
          ]
        }
      ],
      pages: [],
      assignments: [
        {
          id: "201",
          name: "Assignment 1",
          pointsPossible: 100,
          dueAt: "2026-10-01T23:59:59Z"
        }
      ],
      discussions: [],
      events: []
    };

    const envelope: CanvasSyncEnvelope = {
      version: "1",
      source: "canvas-browser-extension",
      payload: samplePayload
    };

    expect(envelope.version).toBe("1");
    expect(envelope.source).toBe("canvas-browser-extension");
    expect(envelope.payload.courseId).toBe("12345");
    expect(envelope.payload.modules).toHaveLength(1);
    expect(envelope.payload.assignments).toHaveLength(1);
  });

  it("maintains version consistency across package.json and all manifests", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const root = path.resolve(__dirname, "..");
    const pkg = JSON.parse(fs.readFileSync(path.resolve(root, "package.json"), "utf8"));
    const manifest = JSON.parse(fs.readFileSync(path.resolve(root, "manifest.json"), "utf8"));
    const chromeManifest = JSON.parse(fs.readFileSync(path.resolve(root, "manifest.chrome.json"), "utf8"));
    const firefoxManifest = JSON.parse(fs.readFileSync(path.resolve(root, "manifest.firefox.json"), "utf8"));

    expect(manifest.version).toBe(pkg.version);
    expect(chromeManifest.version).toBe(pkg.version);
    expect(firefoxManifest.version).toBe(pkg.version);
  });
});

