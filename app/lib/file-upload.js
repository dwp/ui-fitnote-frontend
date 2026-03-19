import Busboy from "@fastify/busboy";
import { uploadValidationErrors } from "../definitions/validators/file-validator.js";
import logger from "../utilities/logger.js";
import { filesize } from "filesize";

export function fileUpload(req, res, next) {
  const maxFileSize = 10000000;
  const fileField = "userPhoto";
  const validMimeTypes = new RegExp("^image/");
  const limits = {
    fileSize: maxFileSize,
    fields: 2,
    files: 1,
  };
  const sessionId = req.sessionID;

  const busboy = new Busboy({ headers: req.headers, limits });
  req.file = Object.create(null);
  logger.info("fileUpload(): Starting file upload");

  busboy.on("file", (fieldName, file, filename, encoding, mimetype) => {
    if (fieldName !== fileField) {
      logger.warn(
        "fileUpload(): WARNING File not in form field as expected, discard file",
      );
      file.resume();
      return;
    }

    if (filename === "") {
      logger.warn("fileUpload(): File name missing, discard file");
      req.body[fileField] = uploadValidationErrors.PROBLEM;
      file.resume();
      return;
    }

    if (!validMimeTypes.test(mimetype) && mimetype !== "application/pdf") {
      logger.warn(
        `File type (${mimetype}) is invalid, for sessionId ${sessionId}`,
      );
      req.body[fileField] = uploadValidationErrors.BAD_TYPE;
      file.resume();
      return;
    }

    const tempBuffers = [];
    const fileMeta = {
      name: "",
      type: "",
      size: 0,
    };

    file.on("limit", () => {
      let imageSize = parseInt(req.headers["content-length"], 10);
      imageSize = filesize(imageSize, { exponent: 2, round: 1 });
      logger.warn(
        `File size ${imageSize} is invalid, for sessionId ${sessionId}`,
      );
      req.body[fileField] = uploadValidationErrors.SIZE;
      file.resume();
    });

    file.on("error", (err) => {
      logger.error("fileUpload(): Error uploading file", err);
      req.body[fileField] = uploadValidationErrors.PROBLEM;
    });

    file.on("data", (data) => {
      fileMeta.size += data.length;
      tempBuffers.push(data);
    });

    file.on("end", () => {
      // Already assigned an error status, don't handle file
      if (typeof req.body[fileField] === "string") {
        return;
      }

      try {
        const fileBuffer = Buffer.concat(tempBuffers, fileMeta.size);

        fileMeta.name = filename;
        fileMeta.type = mimetype;

        req.body[fileField] = fileMeta;
        req.file[fileField] = fileBuffer;
      } catch (err) {
        logger.error("fileUpload(): Error parsing uploaded file", err);
        req.body[fileField] = uploadValidationErrors.PROBLEM;
      }
    });
  });

  busboy.on("field", (fieldname, val) => {
    req.body[fieldname] = val;
  });

  busboy.on("error", (err) => {
    logger.error("fileUpload(): Error handling multipart/form-data", err);
    req.body[fileField] = uploadValidationErrors.PROBLEM;
    next();
  });

  busboy.on("filesLimit", () => {
    logger.error("fileUpload(): Too many files");
    req.body[fileField] = uploadValidationErrors.PROBLEM;
  });

  busboy.on("finish", () => {
    // If file field still empty, mark as missing
    req.body[fileField] ??= "missing";
    if (req.file[fileField]) {
      logger.info("fileUpload(): File received successfully");
      logger.info(
        `File type is ${req.body[fileField].type}, for sessionId ${sessionId}`,
      );
      const imageSize = filesize(req.body[fileField].size, {
        exponent: 2,
        round: 1,
      });
      logger.info(`File size is ${imageSize}, for sessionId ${sessionId}`);
    } else {
      logger.info(`fileUpload(): File invalid, reason: ${req.body[fileField]}`);
    }
    next();
  });
  req.pipe(busboy);
}
