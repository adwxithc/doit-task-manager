import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();



class SendMail {
    private transporter: nodemailer.Transporter;

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"), // if we dont do this the host will show warning
            secure:false,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

 

    sendEmailVerification(name: string, email: string, verificationCode: string): Promise<{ success: boolean; }> {
        return new Promise((resolve, reject) => {
            const mailOptions: nodemailer.SendMailOptions = {
                from: process.env.SMTP_MAIL,
                to: email,
                subject: "Task Management Verification",
                html:generateVerificationHtml(verificationCode,name)
                
            };

            this.transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    
                    reject({ success: false, error: err });
                } else {
                    resolve({ success: true });
                }
            });
        });
        
    }
}

export const sendMail= new SendMail();



export const generateVerificationHtml=(verificationCode:string,name:string)=>{

    const html=`
    <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Speakex Account Verification</title>
                    <style>
                      html {
                      background: #0A102A;
                      color: white;
                      margin: 0;
                      padding: 0;
                      height: 100%;
                      }
                        body {
                            font-family: Arial, sans-serif;
                      height: 100%;       
                            background-color: #0A102A;
                      color: white;
                        background-repeat: repeat;
                      background : url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232343D8' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                
                
                        }
                
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                        }
                
                        .verification-code {
                            background-color: #09122D;
                              border: 1px solid #23346C;
                            padding: 10px;
                            font-weight: bold;
                            font-size: 18px;
                              border-radius: 0.5rem;
                              color: white;
                            text-align: center;
                        }
                
                        .contact-info {
                            margin-top: 20px;
                        }
                      .header{
                      font-weight: bold;
                      font-size: 33px;
                      text-align: center;
                      color: #2A59F5;
                      padding: 1px;
                      }
                    </style>
                </head>
                <body>
                        <div class="header">
                              <div class="container">
                        <p>Task Manager</p>
                          </div>
                
                      </div>
                    <div class="container">
                
                        <p>Dear ${name},</p>
                        <p>Welcome to Task Manager, starting point for your language learning journey! We're thrilled to have you on with us. To ensure the security of your Task Manager account, we need to verify your email address.</p>
                <br/>
                            <p>Please use the following verification code to complete the process:</p>
                        <div class="verification-code">
                
                            <p>${verificationCode}</p>
                        </div>
                      <br/>
                        <p>If you haven't initiated this verification or encounter any issues, please reach out. We're here to help.</p>
                
                
                        <p>Thank you for choosing Task Manager!</p>
                
                        <div class="contact-info">
                            <p>- Task Manager</p>
                        </div>
                      <br/>
                      <br/>
                      <br/>
                    </div>
                </body>
                </html>`;
    return html;
};