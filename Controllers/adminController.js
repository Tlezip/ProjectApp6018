exports.isAdmin = (req, res) => {
    if(req.session && req.session.authenticated){
        if(req.session.isAdmin){
            return res.json({ isAdmin: true })
        }
        else{
            return res.json({ isAdmin: false })
        }
    }
}