import nodemailer from "nodemailer";

export const emailRegistro = async ( datos ) => {
    const { email, nombre, token} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT ,
        auth: {
          user: process.env.EMAIL_USE,
          pass: process.env.EMAIL_PASS
        }
      });

      //INFORMACION DEL MAIL


      const info = await transport.sendMail({
            from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
            to: email,
            subject: "UpTask - Confirma tu cuenta",
            text: "Comprueba tu cuenta en UpTask",
            html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask <p/>
                    
                    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: </p>
                    
                    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
                    
                    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
            `
      })

};

export const emailOlvidePassword = async ( datos ) => {
  const { email, nombre, token} = datos;

   const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ,
    auth: {
      user: process.env.EMAIL_USE,
      pass: process.env.EMAIL_PASS
    }
    });

    //INFORMACION DEL MAIL


    const info = await transport.sendMail({
          from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
          to: email,
          subject: "UpTask - Reestablece tu password",
          text: "Reestablece tu password",
          html: `<p>Hola: ${nombre} has solicitado reestablecer tu password <p/>
                  
                  <p>Sigue el siguiente enlace para generar un nuevo password: </p>
                  
                  <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablece password</a>
                  
                  <p>Si tu no solicistate cambio de password, puedes ignorar el mensaje</p>
          `
    })

};