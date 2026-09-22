import type { BrowserSyncOptions, CourseDataAvailabilityReport } from "./types";
import { DEFAULT_BROWSER_OPTIONS } from "./types";
import { getAvailabilityStatusDisplay } from "./sync-utils";

declare const browser: {
  permissions?: {
    contains?: (permissions: { origins: string[] }) => Promise<boolean>;
    request?: (permissions: { origins: string[] }) => Promise<boolean>;
  };
} | undefined;

const statusEl = document.querySelector<HTMLDivElement>("#status");
const syncBtn = document.querySelector<HTMLButtonElement>("#syncBtn");
const testBtn = document.querySelector<HTMLButtonElement>("#testBtn");
const scanBtn = document.querySelector<HTMLButtonElement>("#scanBtn");
const portInput = document.querySelector<HTMLInputElement>("#port");
const pairingTokenInput = document.querySelector<HTMLInputElement>("#pairingToken");
const toggleTokenBtn = document.querySelector<HTMLButtonElement>("#toggleTokenBtn");
const courseCodeDisplay = document.querySelector<HTMLDivElement>("#courseCodeDisplay");
const courseNameDisplay = document.querySelector<HTMLDivElement>("#courseNameDisplay");
const availabilityContainer = document.querySelector<HTMLDivElement>("#availabilityContainer");

const optModules = document.querySelector<HTMLInputElement>("#optModules");
const optAssignments = document.querySelector<HTMLInputElement>("#optAssignments");
const optGrades = document.querySelector<HTMLInputElement>("#optGrades");
const optAnnouncements = document.querySelector<HTMLInputElement>("#optAnnouncements");
const optDiscussions = document.querySelector<HTMLInputElement>("#optDiscussions");
const optDiscussionReplies = document.querySelector<HTMLInputElement>("#optDiscussionReplies");
const optEvents = document.querySelector<HTMLInputElement>("#optEvents");
const optFiles = document.querySelector<HTMLInputElement>("#optFiles");

if (
  !statusEl ||
  !syncBtn ||
  !testBtn ||
  !scanBtn ||
  !portInput ||
  !pairingTokenInput ||
  !toggleTokenBtn ||
  !courseCodeDisplay ||
  !courseNameDisplay ||
  !availabilityContainer ||
  !optModules ||
  !optAssignments ||
  !optGrades ||
  !optAnnouncements ||
  !optDiscussions ||
  !optDiscussionReplies ||
  !optEvents ||
  !optFiles
) {
  throw new Error("Popup UI elements failed to initialize.");
}

const safeStatusEl = statusEl;
const safeSyncBtn = syncBtn;
const safeTestBtn = testBtn;
const safeScanBtn = scanBtn;
const safePortInput = portInput;
const safePairingTokenInput = pairingTokenInput;
const safeToggleTokenBtn = toggleTokenBtn;
const safeCourseCodeDisplay = courseCodeDisplay;
const safeCourseNameDisplay = courseNameDisplay;
const safeAvailabilityContainer = availabilityContainer;

const safeOptModules = optModules;
const safeOptAssignments = optAssignments;
const safeOptGrades = optGrades;
const safeOptAnnouncements = optAnnouncements;
const safeOptDiscussions = optDiscussions;
const safeOptDiscussionReplies = optDiscussionReplies;
const safeOptEvents = optEvents;
const safeOptFiles = optFiles;

let detectedCourseCode = "";
let detectedCourseName = "";

interface SyncResponse {
  ok?: boolean;
  message?: string;
}

interface DetectCourseResponse {
  ok?: boolean;
  courseCode?: string;
  courseName?: string;
  message?: string;
}

interface ProbeCourseResponse {
  ok?: boolean;
  report?: CourseDataAvailabilityReport;
  message?: string;
}

async function getStoredOptions(): Promise<BrowserSyncOptions> {
  try {
    if (chrome.storage?.local) {
      const stored = await chrome.storage.local.get<{ browserSyncOptions?: Partial<BrowserSyncOptions> }>([
        "browserSyncOptions"
      ]);
      return Object.assign({}, DEFAULT_BROWSER_OPTIONS, stored.browserSyncOptions || {});
    }
  } catch {
    // Ignore storage errors and use defaults
  }
  return DEFAULT_BROWSER_OPTIONS;
}

async function saveStoredOptions(): Promise<void> {
  const options: BrowserSyncOptions = {
    extractModules: safeOptModules.checked,
    extractPages: safeOptModules.checked,
    extractAssignments: safeOptAssignments.checked,
    extractGrades: safeOptGrades.checked,
    extractAnnouncements: safeOptAnnouncements.checked,
    extractDiscussions: safeOptDiscussions.checked,
    includeDiscussionReplies: safeOptDiscussionReplies.checked,
    extractEvents: safeOptEvents.checked,
    extractFiles: safeOptFiles.checked,
    bridgePort: Number.parseInt(safePortInput.value, 10) || 27125,
    bridgePairingToken: safePairingTokenInput.value.trim() || undefined
  };

  try {
    if (chrome.storage?.local) {
      await chrome.storage.local.set({ browserSyncOptions: options });
    }
  } catch {
    // Ignore
  }
}

async function ensureBridgePermission(): Promise<boolean> {
  return true;
}

function setStatus(message: string, className: "" | "ok" | "error"): void {
  safeStatusEl.textContent = message;
  safeStatusEl.className = className;
}

function renderAvailabilityReport(report: CourseDataAvailabilityReport): void {
  safeAvailabilityContainer.innerHTML = "";
  const categories = report.categories || {};

  const keys = Object.keys(categories);
  if (keys.length === 0) {
    safeAvailabilityContainer.textContent = "No data categories available.";
    return;
  }

  for (const key of keys) {
    const item = categories[key];
    if (!item) continue;

    const chip = document.createElement("div");
    chip.className = "availability-chip";

    const labelSpan = document.createElement("span");
    labelSpan.className = "chip-label";
    labelSpan.textContent = item.label || key;
    labelSpan.title = item.details ? `${item.label}: ${item.details}` : item.label;

    const badgeSpan = document.createElement("span");
    badgeSpan.className = `chip-badge status-${item.status}`;

    const display = getAvailabilityStatusDisplay(item.status);
    badgeSpan.textContent = `${display.icon} ${display.text}`;

    chip.appendChild(labelSpan);
    chip.appendChild(badgeSpan);
    safeAvailabilityContainer.appendChild(chip);
  }
}

async function initForm(): Promise<void> {
  const options = await getStoredOptions();

  safeOptModules.checked = options.extractModules;
  safeOptAssignments.checked = options.extractAssignments;
  safeOptGrades.checked = options.extractGrades;
  safeOptAnnouncements.checked = options.extractAnnouncements;
  safeOptDiscussions.checked = options.extractDiscussions;
  safeOptDiscussionReplies.checked = options.includeDiscussionReplies;
  safeOptEvents.checked = options.extractEvents;
  safeOptFiles.checked = options.extractFiles;
  safePortInput.value = String(options.bridgePort || 27125);
  safePairingTokenInput.value = options.bridgePairingToken || "";

  const checkboxes = [
    safeOptModules,
    safeOptAssignments,
    safeOptGrades,
    safeOptAnnouncements,
    safeOptDiscussions,
    safeOptDiscussionReplies,
    safeOptEvents,
    safeOptFiles
  ];

  for (const cb of checkboxes) {
    cb.addEventListener("change", () => {
      void saveStoredOptions();
    });
  }

  safePortInput.addEventListener("change", () => {
    void saveStoredOptions();
  });

  safePairingTokenInput.addEventListener("change", () => {
    void saveStoredOptions();
  });

  safeToggleTokenBtn.addEventListener("click", () => {
    if (safePairingTokenInput.type === "password") {
      safePairingTokenInput.type = "text";
      safeToggleTokenBtn.textContent = "🙈";
    } else {
      safePairingTokenInput.type = "password";
      safeToggleTokenBtn.textContent = "👁️";
    }
  });

  // Detect course from active tab
  try {
    let tabId: number | undefined;
    if (chrome.tabs?.query) {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tabId = activeTab?.id;
    }

    const response = await chrome.runtime.sendMessage<unknown, DetectCourseResponse | undefined>({
      type: "detectCourseInfo",
      tabId
    });

    if (response?.ok && response.courseName) {
      detectedCourseCode = response.courseCode || "";
      detectedCourseName = response.courseName;

      safeCourseCodeDisplay.textContent = detectedCourseCode ? `[${detectedCourseCode}]` : "Course Detected";
      safeCourseNameDisplay.textContent = detectedCourseName;
      setStatus("Ready to sync.", "ok");
    } else {
      safeCourseCodeDisplay.textContent = "No Canvas course tab active";
      safeCourseNameDisplay.textContent = "Navigate to a Canvas course page";
      setStatus("Navigate to a Canvas course page in your browser.", "");
    }
  } catch {
    safeCourseCodeDisplay.textContent = "Canvas Sync";
    safeCourseNameDisplay.textContent = "Open a Canvas course tab";
    setStatus("Navigate to a Canvas course page in your browser.", "");
  }
}

safeScanBtn.addEventListener("click", () => {
  void (async () => {
    setStatus("Scanning course data availability...", "");
    safeScanBtn.disabled = true;
    safeAvailabilityContainer.innerHTML = "";

    try {
      let tabId: number | undefined;
      if (chrome.tabs?.query) {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        tabId = activeTab?.id;
      }

      const response = await chrome.runtime.sendMessage<unknown, ProbeCourseResponse | undefined>({
        type: "probeCourseAvailability",
        tabId
      });

      if (!response?.ok || !response.report) {
        throw new Error(response?.message || "Failed to scan course availability.");
      }

      renderAvailabilityReport(response.report);
      setStatus("Availability scan complete.", "ok");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Availability scan failed.", "error");
    } finally {
      safeScanBtn.disabled = false;
    }
  })();
});

safeSyncBtn.addEventListener("click", () => {
  void (async () => {
    setStatus("Extracting Canvas course...", "");
    safeSyncBtn.disabled = true;

    try {
      const granted = await ensureBridgePermission();
      if (!granted) {
        setStatus("Localhost access was blocked by the browser. Please allow permission.", "error");
        return;
      }

      await saveStoredOptions();
      const options = await getStoredOptions();

      let tabId: number | undefined;
      if (chrome.tabs?.query) {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        tabId = activeTab?.id;
      }

      const response = await chrome.runtime.sendMessage<unknown, SyncResponse | undefined>({
        type: "syncCanvasCourse",
        port: options.bridgePort,
        courseCode: detectedCourseCode || undefined,
        courseName: detectedCourseName || undefined,
        options,
        tabId
      });

      if (!response?.ok) {
        throw new Error(response?.message || "Sync failed.");
      }
      setStatus("Sync complete! Notes generated in Obsidian.", "ok");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Sync failed.", "error");
    } finally {
      safeSyncBtn.disabled = false;
    }
  })();
});

safeTestBtn.addEventListener("click", () => {
  void (async () => {
    setStatus("Testing Obsidian bridge connection...", "");
    safeTestBtn.disabled = true;

    try {
      const granted = await ensureBridgePermission();
      if (!granted) {
        setStatus("Localhost access was blocked. Please grant bridge permissions.", "error");
        return;
      }

      const port = Number.parseInt(safePortInput.value, 10) || 27125;
      const token = safePairingTokenInput.value.trim();
      const headers: Record<string, string> = {};
      if (token) {
        headers["X-Canvas-Bridge-Token"] = token;
      }
      const res = await globalThis.fetch(`http://127.0.0.1:${port}/health`, { method: "GET", headers }).catch(async () => {
        return await globalThis.fetch(`http://127.0.0.1:${port}/canvas-sync`, { method: "OPTIONS", headers });
      });

      if (res.status >= 200 && res.status < 300) {
        setStatus(`✅ Connected to Obsidian bridge on port ${port}.`, "ok");
      } else {
        throw new Error(`Bridge returned status ${res.status}`);
      }
    } catch {
      setStatus("❌ Could not connect. Ensure Obsidian plugin is enabled with 'Enable Browser Bridge' turned on.", "error");
    } finally {
      safeTestBtn.disabled = false;
    }
  })();
});

void initForm();

