var fs = require('fs');
const db = require('../db')

exports.download = (req, res) => {
    console.log(req.body)
    const { filename,id } = req.params
    console.log('fileupload/' + id + '/' + filename)
    return res.download('fileupload/' + id + '/' + filename);
}

exports.upload = (req, res) => {
    // console.log('121123123123123')
    // console.log(req)
    // console.log(req.body.requestid)
    // console.log(req)
    if (!req.files){
        return res.status(400).send('No files were uploaded.');
    }
    // console.log(req.files)
    console.log(Object.keys(req.files))
    const objectfile = Object.keys(req.files)
    objectfile.forEach((fileobj) => {
        const file = req.files[fileobj]
        if (!fs.existsSync('fileupload/' + req.body.requestid)){
            fs.mkdirSync('fileupload/' + req.body.requestid);
        }
        file.mv('fileupload/' + req.body.requestid + "/" + file.name, (err) => {
            if(err)
                console.log(err)
            console.log('File uploaded!')
        })
        db.query("INSERT INTO fileupload (RequestID,filename) VALUES ('" + req.body.requestid + "','" + file.name + "')", (err, result) => {
        })
    })
    // console.log(req.files['files[0]'])
    // const file = req.files['files[0]']
    // file.mv('fileupload/' + file.name, function(err) {
    //     if (err)
    //       return res.status(500).send(err);
     
    //     console.log('File uploaded!');
    //   });



  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    // let sampleFile = req.files.files[0];
    // req.files.forEach((file) => {
    //     const namefile = file.name
    //     console.log(name)
    //     file.mv('fileupload/' + namefile, function(err) {
    //         if (err)
    //           return res.status(500).send(err);
         
    //         res.send('File uploaded!');
    //       });
    // })
    // const namefile = sampleFile
 
  // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv('fileupload/' + namefile, function(err) {
//     if (err)
//       return res.status(500).send(err);
 
//     res.send('File uploaded!');
//   });
}