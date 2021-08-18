const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const yaml = require('js-yaml');
var xmlparser = require('express-xml-bodyparser');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xmlparser());

const directoryPathFiles = (filename) => {
  if (filename) return path.resolve(__dirname, `public/files/${filename}`);
  return path.resolve(__dirname, 'public/files');
};

const getFiles = () => {
  const files = fs.readdirSync(directoryPathFiles(null), (err, files) => {
    if (err) res.status(500).json({ message: 'Server error' });
    return files ? [...files] : [];
  });

  return files;
};

app.get('/api/files', function (req, res, err) {
  res.status(200).json({
    message: 'success',
    files: getFiles(),
  });
});

app.get('/api/files/:filename', function (req, res, err) {
  const filename = req.params.filename;
  const extension = path.extname(filename).slice(1);
  const filePath = path.resolve(__dirname, `public/files/${filename}`);

  switch (extension) {
    case 'txt':
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res
            .status(400)
            .json({ message: `No file with ${filename} filename found` });
        } else {
          res.status(200).json({
            message: 'Success',
            filename,
            content: JSON.parse(data).content,
            extension,
            uploadedDate: JSON.parse(data).uploadedDate,
          });
        }
      });
      break;
    case 'json':
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res
            .status(400)
            .json({ message: `No file with ${filename} filename found` });
        } else {
          res.status(200).json({
            message: 'Success',
            filename,
            content: JSON.parse(data).content,
            extension,
            uploadedDate: JSON.parse(data).uploadedDate,
          });
        }
      });
      break;
    case 'js':
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res
            .status(400)
            .json({ message: `No file with ${filename} filename found` });
        } else {
          res.status(200).json({
            message: 'Success',
            filename,
            content: JSON.parse(data).content,
            extension,
            uploadedDate: JSON.parse(data).uploadedDate,
          });
        }
      });
      break;
    case 'yaml':
      try {
        const doc = yaml.load(fs.readFileSync(filePath, 'utf8'));

        res.status(200).json({
          message: 'Success',
          filename,
          content: doc.content,
          extension,
          uploadedDate: doc.uploadedDate,
        });
      } catch (e) {
        res
          .status(400)
          .json({ message: `No file with ${filename} filename found` });
      }
      break;

    default:
      res.status(500).json({ message: 'Server error' });
  }
});

const createFile = (req, res) => {
  const { filename, content } = req.body;
  const ext = path.extname(filename).slice(1);

  if (
    content === '' ||
    typeof content === 'undefined' ||
    filename === '' ||
    typeof filename === 'undefined'
  ) {
    return res.json({ message: "Please specify 'content' parameter" });
  } else {
    let filePath = path.resolve(__dirname, `public/files/${filename}`);

    switch (ext) {
      case 'txt':
        fs.writeFileSync(
          filePath,
          JSON.stringify({ content, uploadedDate: new Date() }),
          (err) => res.json({ message: 'Server error' })
        );
        res.json({ message: 'File created successfully' });
        break;
      case 'json':
        fs.writeFileSync(
          filePath,
          JSON.stringify({ content, uploadedDate: new Date() }),
          (err) => res.json({ message: 'Server error' })
        );
        res.json({ message: 'File created successfully' });
        break;
      case 'js':
        fs.writeFileSync(
          filePath,
          JSON.stringify({ content, uploadedDate: new Date() }),
          (err) => res.json({ message: 'Server error' })
        );
        res.json({ message: 'File created successfully' });
        break;
      case 'yaml':
        let data = { content, uploadedDate: new Date() };
        let yamlStr = yaml.dump(data);
        fs.writeFileSync(filePath, yamlStr, 'utf8');

        res.json({ message: 'File created successfully' });
        break;
      default:
        res.json({ message: 'server error' });
        break;
    }
  }
};

app.post('/api/files', (req, res) => {
  createFile(req, res);
});

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(
    'Port is running on:' + ` http://localhost:${port}`.underline.cyan
  )
);
