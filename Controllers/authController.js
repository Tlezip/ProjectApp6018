exports.auth = (req, res, next) => {
    if(req.session && req.session.authenticated){
        return next();
    }
    else
        return res.redirect('/login');
}

exports.no_auth = (req, res, next) => {
    if(!req.session.authenticated){
        req.session.authenticated = false
        return next()
    }
    else
        return res.redirect('/');
}