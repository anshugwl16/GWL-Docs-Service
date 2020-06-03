import { version } from "../../package.json";
import { Router } from "express";
import Ajv from "ajv";
import task from "../model/task";
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const formidable = require('formidable');
const asyncHandler = require('express-async-handler');
import { fileUpload, fileSearch } from '../s3-aws/index';

import envVariables from '../envVariables';

export default ({ config, db }) => {
  let api = Router();

  /* api.post("/upload_file", (req, res) => {

    const form = formidable({ multiples: true });
    let responseArr = [];

    form.parse(req, asyncHandler(async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      };

      // console.log('#fields', fields);
      // console.log('#files', files);

      responseArr = await fileUpload(fields, files);

    }));

  }); */

  api.post("/upload_file2", asyncHandler(async (req, res) => {

    try {
      const form = formidable({ multiples: true });
      let responseArr = [];

      form.parse(req, async (err, fields, files) => {
        if (err) {
          next(err);
          return;
        };

        // console.log('#fields', fields);
        // console.log('#files', files);

        for (const file in files) {
          let fileUploadAW = await fileUpload(files[file]);
          responseArr.push(fileUploadAW);
        };

        // console.log(fileUploadAW);

        // responseArr = await fileUpload(fields, files);
        res.status(200).json({ "uploadResponse": responseArr });
      });
    } catch (e) {
      res.status(500).send(e);
    }
  }));

  api.post("/file_search", asyncHandler(async (req, res) => {
    try {
      const { key } = req.body;
      let file = await fileSearch(key);
      res.status(200).send({ "searchResponse": file });
    } catch (e) {
      res.status(500).send(e);
    }
  }));
  return api;
};