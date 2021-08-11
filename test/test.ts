import bcrypt from "bcrypt";

function encrypt(pass: string, cb: any) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return cb(err);
        }
    
        bcrypt.hash(pass, salt, function(err, hash) {
            cb(err, hash);
        });
    });
}

const pass = encrypt("Hello", (err: string, p: any) => {
    console.log(p);

    bcrypt.compare("Hello", p, function(err, isPasswordMatch) {   
        console.log(isPasswordMatch);
    });
});

