const { ca } = require("date-fns/locale")
const allowedOrigins = require("./allowedOrigins")

const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== 1 || !origin){ //!origin no origin to allow access from postman and such
            callback(null, true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentails: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions