import { Router, type IRouter } from "express";
import { SubmitContactFormBody, SubmitContactFormResponse } from "@workspace/api-zod";
import fs from "node:fs";
import path from "node:path";
import { logger } from "../lib/logger";
import { sendContactNotification } from "../lib/email";

const router: IRouter = Router();

// Save messages to the root directory of the workspace
const messagesFilePath = path.resolve(process.cwd(), "..", "..", "messages.json");

router.post("/contact", async (req, res, next) => {
  try {
    // Validate request body
    const body = SubmitContactFormBody.parse(req.body);
    const { name, email, message } = body;

    logger.info({ name, email }, "Received contact form transmission");

    // Load existing messages or initialize empty array
    let messages = [];
    if (fs.existsSync(messagesFilePath)) {
      try {
        const fileContent = fs.readFileSync(messagesFilePath, "utf-8");
        messages = JSON.parse(fileContent || "[]");
      } catch (err) {
        logger.error({ err }, "Error parsing messages.json, initializing empty array");
      }
    }

    // Append new message payload
    const newMessage = {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);

    // Save back to local messages.json file
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), "utf-8");
    logger.info({ messagesFilePath }, "Saved contact form message locally to messages.json");

    // Trigger email notification in the background (non-blocking)
    sendContactNotification(name, email, message).catch(err => {
      logger.error({ err }, "Background email alert failed");
    });

    res.json(SubmitContactFormResponse.parse({ success: true }));
  } catch (error) {
    logger.error({ err: error }, "Error in contact router handler");
    next(error);
  }
});

export default router;
