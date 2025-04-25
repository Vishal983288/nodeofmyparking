
const mailer = require ('nodemailer')

const sendingmail = async (to,subject,text)=>{

    const transpoter = mailer.createTransport({

        service: 'gmail',
        auth:{
            user:'shiyalv10@gmail.com',
            pass:'oqji ehul thvs fodx'
        }
    })
    const mailOption = {
        from:'shiyalv10@gmail.com',
        to:to,
        subject: subject ,
        text:"You are sucsessfully SignUp in My Parking",
        html: `<h2>Welcome to My Parking</h2>
             <p>Dear User,</p>
             <p>Thank you for signing up. We are excited to have you!</p>
             <p>Enjoy our services.</p>
             <br>
             <p>Best Regards,</p>
             <p><strong>My Parking Team</strong></p>`,

                

    }

    const mailresponse = await transpoter.sendMail(mailOption);
    console.log(mailresponse);
    return mailresponse;

}

module.exports ={
    sendingmail
}


