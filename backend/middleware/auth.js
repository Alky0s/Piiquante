// We imports jwt package
const jwt = require('jsonwebtoken');
// Token middleware function to export
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'F78k4q746Y7PzQDpUqL86xhXKBi3cs');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};