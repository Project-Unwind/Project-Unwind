
import { Router } from "express";

import {
  monitoredNestedRouter
} from "../../middleware/apiMonitoring.js";

import journalEntryRoutes from "./journalEntry.routes.js";
import journalAttachmentRoutes from "./journalAttachment.routes.js";
import journalPromptRoutes from "./journalPrompt.routes.js";
import journalVoiceRoutes from "./journalVoice.routes.js";
import journalSecurityRoutes from "./journalSecurity.routes.js";
import journalSearchRoutes from "./journalSearch.routes.js";
import journalPdfExportRoutes from "./journalPdfExport.routes.js";
import journalMetadataRoutes from "./journalMetadata.routes.js";

const router = Router();

router.use(
  "/metadata",
  ...monitoredNestedRouter("/metadata", journalMetadataRoutes)
);

router.use(
  "/entries",
  ...monitoredNestedRouter("/entries", journalEntryRoutes)
);

router.use(
  "/attachments",
  ...monitoredNestedRouter("/attachments", journalAttachmentRoutes)
);

router.use(
  "/prompts",
  ...monitoredNestedRouter("/prompts", journalPromptRoutes)
);

router.use(
  "/voice",
  ...monitoredNestedRouter("/voice", journalVoiceRoutes)
);

router.use(
  "/security",
  ...monitoredNestedRouter("/security", journalSecurityRoutes)
);

router.use(
  "/search",
  ...monitoredNestedRouter("/search", journalSearchRoutes)
);

router.use(
  "/export",
  ...monitoredNestedRouter("/export", journalPdfExportRoutes)
);

export default router;
