import Busboy from "@fastify/busboy";
import { uploadValidationErrors } from "../definitions/validators/file-validator.js";
import logger from "../utilities/logger.js";

export function fileUpload(req, res, next) {
  const maxFileSize = 10000000;
  const fileField = "userPhoto";
  const validMimeTypes = new RegExp("^image/");
  const limits = {
    fileSize: maxFileSize,
    fields: 2,
    files: 1,
  };

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
      logger.warn("fileUpload(): File type is not accepted, discard file");
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
    } else {
      logger.info(`fileUpload(): File invalid, reason: ${req.body[fileField]}`);
    }
    next();
  });
  req.pipe(busboy);
}
