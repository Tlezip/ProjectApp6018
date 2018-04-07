exports.auth = (req, res, next) => {
    // req.cookies['connect.sid'] = req.query.sessionId;
    // console.log(req.headers)
    // console.log(req.session)
    if(req.session && req.session.authenticated){
        return next();
    }
    else{
        console.log('inauthfalse')
        res.json({ auth: false})
    }
}

exports.no_auth = (req, res, next) => {
    if(!req.session.authenticated){
        req.session.authenticated = false
        return next()
    }
    else{
        return res.json({ auth: true})
    }
}

exports.isAdmin = (req, res, next) => {
    if(req.session && req.session.authenticated){
        if(req.session.isAdmin){
            return next()
        }
        else{
            return res.json({ isAdmin: false })
        }
    }
}