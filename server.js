const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
const http = require('http').Server(app);

app.use(cors());
app.use(fileUpload());
app.use(express.static('public'));

app.post('/update', (req, res) => {
  const file = req.files.firmware;
  const filePath = __dirname + '/uploads/firmware.bin';

  file.mv(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('Update successful!');
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/test.html');
});

http.listen(3000, () => {
  console.log('Server is running on port 3000');
});
 