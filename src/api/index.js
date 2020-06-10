import { version } from "../../package.json";
import { Router } from "express";
const formidable = require('formidable');
const asyncHandler = require('express-async-handler');
import { fileUpload, fileSearch, fileDelete } from '../s3-bucket/index';

export default ({ config, db }) => {
  let api = Router();



  api.post("/upload_file", asyncHandler(async (req, res) => {

    try {
      const form = formidable({ multiples: true });
      let responseArr = [];

      form.parse(req, async (err, fields, files) => {
        if (err) {
          next(err);
          return;
        };

        let { key } = fields || 'misc';

        for (const file in files) {
          let fileUploadAW = await fileUpload(key, files[file]);
          responseArr.push(fileUploadAW);
        };

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

  api.post("/file_delete", asyncHandler(async (req, res) => {
    
    try {
      const { keys } = req.body;
      console.log('#keys', keys);
      let responseArr = [];

      for (let i = 0; i < keys.length; i++) {
        let fileDeleteAw = await fileDelete(keys[i]);
        console.log('#fileDeleteAw', fileDeleteAw);
        responseArr.push(fileDeleteAw);
      };
      
      /* keys.map(asyncHandler(async (key) => {
        let fileDeleteAw = await fileDelete(key);
        responseArr.push(fileDeleteAw);
      })); */

      res.status(200).send(responseArr);
    } catch (e) {
      res.status(500).send(e);
    }
  }));

  return api;
};
