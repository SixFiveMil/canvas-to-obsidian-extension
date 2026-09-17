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
          id: 1,
          name: "Module 1: Getting Started",
          position: 1,
          items: [
            {
              id: 101,
              title: "Welcome Page",
              type: "WikiPage",
              position: 1,
              page_url: "welcome"
            }
          ]
        }
      ],
      assignments: [
        {
          id: 201,
          name: "Assignment 1",
          points_possible: 100,
          due_at: "2026-10-01T23:59:59Z"
        }
      ]
    };

    const envelope: CanvasSyncEnvelope = {
      protocol: "canvas-sync-bridge",
      version: "1",
      source: "canvas-browser-extension",
      payload: samplePayload
    };

    expect(envelope.protocol).toBe("canvas-sync-bridge");
    expect(envelope.version).toBe("1");
    expect(envelope.source).toBe("canvas-browser-extension");
    expect(envelope.payload.courseId).toBe("12345");
    expect(envelope.payload.modules).toHaveLength(1);
    expect(envelope.payload.assignments).toHaveLength(1);
  });
});
