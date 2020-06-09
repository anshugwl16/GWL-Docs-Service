const fs = require('fs');
const AWS = require('aws-sdk');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

import envVariables from '../envVariables';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { response } from 'express';

const spacesEndPoint = new AWS.Endpoint(process.env.DO_REGION + '.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndPoint,
    accessKeyId: process.env.DO_ACCESS_KEY,
    secretAccessKey: process.env.DO_SECRET_ACCESS_KEY
});

// console.log('#s3', s3);

/* const bucketName = envVariables.DO_BUCKET_NAME;
s3.createBucket({ Bucket: bucketName }, function (err, data) {
    if (!err) {
        console.log('#err buc', err);
    } else {
        console.log('#data buc', data);
    }
}); */

export const fileUpload = async (key, file = {}) => {
    // console.log('#file', file);

    try {
        console.log('#1');
        let uploadResponse = [];

        const params = {
            Bucket: process.env.DO_BUCKET_NAME,
            Key: `${key}/${file.name}`,
            Body: fs.createReadStream(file.path)
        };

        const options = {
            partSize: 10 * 1024 * 1024,
            queSize: 10
        };

        // console.log('#params',params)
        let promise = new Promise((resolve, reject) => {
            s3.upload(params, async (err, data) => {
                if (!err) {
                    console.log('Successful Upload', data);
                    // uploadResponse = data;
                    // console.log('#2');
                    resolve(data);
                } else {
                    console.log('Upload Failed', err);
                    // console.log('#3');
                    reject(err);
                }
            });
        })
        return await promise;
    } catch (e) {
        console.log(e);
        return await e.code;
    }
};

export const fileSearch = async (key) => {

    console.log('#4')
    const params = {
        Bucket: process.env.DO_BUCKET_NAME,
        Key: key
    };

    let promise = new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (!err) {
                console.log('#Search Data', data);
                resolve(data);
            } else {
                console.log('#Serch Err', err);
                reject(err);
            }
        });
    })
    return await promise;
};

export const fileDelete = (key) => {
    console.log('#5');
    const params = {
        Bucket: process.env.DO_BUCKET_NAME,
        Key: key
    }

    let promise = new Promise((resolve, reject) => {
        s3.deleteObject(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(data);
                resolve(data);
            }
        });
    });
    return await promise;
};



/* const fileUpload = (feilds = {}, files = {}) => {

    for (const file in files) {
        // console.log('#file', file);

        fs.readFile(files[file].path, function (err, data) {
            if (err) throw err;
            try {
                const params = {
                    Bucket: envVariables.DO_BUCKET_NAME,
                    Key: `ams-docs/${file}`,
                    Body: data
                };

                console.log('#data', data);
                console.log('#params', params);

                s3.upload(params, function (s3Err, data) {

                    fs.unlink(files[file].path, function (err) {
                        if (err) {
                            console.error(err);
                        }
                        console.log('Temp File Delete');
                    });

                    if (s3Err) {

                        // res.status(500).send(err);
                        throw s3Err;
                    }
                    console.log('#data upload', data);
                    console.log(`File uploaded successfully at ${data.Location}.`);
                });
            } catch (err) {
                console.log('Error:', err);
            }
        });

    };
}; */