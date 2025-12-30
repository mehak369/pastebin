import express from "express";
import { nanoid } from "nanoid";
import Paste from "../models/Paste.js";
import { getNowMs } from "../utils/time.js";

const router = express.Router();

router.post("/pastes", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const now = Date.now();
  const expiresAt = ttl_seconds ? new Date(now + ttl_seconds * 1000) : null;

  const id = nanoid(10);

  await Paste.create({
    id,
    content,
    expiresAt,
    maxViews: max_views ?? null
  });

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.status(201).json({
    id,
    url: `${baseUrl}/p/${id}`
  });
});

router.get("/pastes/:id", async (req, res) => {
  const now = getNowMs(req);

  const paste = await Paste.findOne({ id: req.params.id });

  if (!paste) {
    return res.status(404).json({ error: "Not found" });
  }

  if (paste.expiresAt && paste.expiresAt.getTime() <= now) {
    return res.status(404).json({ error: "Expired" });
  }

  if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  paste.viewsUsed += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null ? null : paste.maxViews - paste.viewsUsed,
    expires_at: paste.expiresAt ? paste.expiresAt.toISOString() : null
  });
});
router.get("/p/:id", async (req, res) => {
  const now = getNowMs(req);
  const paste = await Paste.findOne({ id: req.params.id });

  if (!paste) return res.status(404).send("Not Found");

  if (paste.expiresAt && paste.expiresAt.getTime() <= now) {
    return res.status(404).send("Not Found");
  }

  if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
    return res.status(404).send("Not Found");
  }

  paste.viewsUsed += 1;
  await paste.save();

  res.send(`
    <html>
      <body>
        <pre>${paste.content.replace(/</g, "&lt;")}</pre>
      </body>
    </html>
  `);
});

export default router;
