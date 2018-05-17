var fs = require('fs');
const db = require('../db')

exports.download = (req, res) => {
    console.log(req.body)
    const { filename,id } = req.params
    console.log('fileupload/' + id + '/' + filename)
    return res.download('fileupload/' + id + '/' + filename);
}

exports.upload = (req, res) => {
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

exports.uploadregister = (req, res) => {
    const fs = require('fs');
    const mailer = require('express-mailer');
    var generator = require('generate-password');
    console.log(req.files)
    console.log(req.files['files[0]'].data)
    console.log("\n" + req.files['files[0]'].data.toString())
    let data = req.files['files[0]'].data.toString()
    console.log(data)
    if (data.charAt(0) === '-') {
        data = data.substr(1)
    }
    if (!req.files){
        console.log('no file')
        return res.status(400).send('No files were uploaded.');
    }
    else {
        // console.log('have file')
        // console.log(data)
        arrayOfData = data.split(/,|\n|\r|\t/)
        let result = arrayOfData.filter(word => word.localeCompare(''))
        console.log(result)
        console.log(result.length)
        if((result.length % 3) != 0){
            return res.status(400).json({ responseMessage: 'wrong data'})
        }
        // let firstindex = result[0]
        // result[0] = firstindex.splice(0,1)
        console.log(result)

        for(let i = 0 ; i+3 <= result.length ; i+=3){
            const email = result[i+1]
            db.query("SELECT UserName,Email FROM UserDetail WHERE UserName = '" + req.body.studentid + "' OR Email = '" + req.body.email + "'", (err, result2) => {
                if(result2.length == 0){
                    var password = generator.generate({
                        length: 10,
                        numbers: true
                        });
                    var token = generator.generate({
                        length: 25,
                        numbers: true
                    })
                    db.query("INSERT INTO UserDetail ( Username, Name, Email, Password, Disabled, Admin, token ) VALUES ('" + result[i] + "','" + result[i] + "','" + result[i+1] + "','" + password + "','0','" + result[i+2] + "','"+ token +"')", (err, result3) => {
                        if(err){
                            console.log(err)
                        }
                        console.log(password)
                        // console.log('123')
                        res.mailer.send('email', {
                        to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                        subject: 'Door-Lock Access Controll : ' + result[0] + " registered", // REQUIRED. 
                        otherProperty: 'Other Property',
                        message: {  // data to view template, you can access as - user.name
                            name: 'Arjun PHP',
                            message: password,
                            url: 'http://161.246.6.1:8007/#/changepassword/' + token
                        }
                        }, function (err) {
                        if (err) {
                            // handle error 
                            console.log(err);
                            // return res.json({ responseMessage: 'can\'t register '})
                            // return;
                        }
                        });
                        // return res.json({ responseMessage: 'register Complete'});
                    })  
                }
            })
            if(i+3 == result.length){
                console.log('Complete Register User')
                return res.json({ responseMessage: 'Complete Register' })
            }
        }
        // const objectfile = Object.keys(req.files)
        // objectfile.forEach((fileobj) => {
        //     const file = req.files[fileobj]
        //     if (!fs.existsSync('fileupload/register')){
        //         fs.mkdirSync('fileupload/register');
        //     }
        //     file.mv('fileupload/register/' + file.name, (err) => {
        //         if(err)
        //             console.log(err)
        //         console.log('File uploaded!')
        //     })
        // })
        // try {  
        //     var data = fs.readFileSync('my-file.txt', 'utf8');
        //     console.log(data);    
        // } catch(e) {
        //     console.log('Error:', e.stack);
        // }
    }
}