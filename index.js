import express from "express";
import dotenv from 'dotenv'
import cors from 'cors';
import conectarDB from "./config/db.js";
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();


//Congirurar CORS
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback){
        if(whiteList.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error("Error de Cors"))
        }
    }
};

app.use(cors(corsOptions));

//ROUTING
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);


const PORT = process.env.PORT || 4000;
const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto 4000 ${PORT}`);
});

// Socket.io
import { Server } from 'socket.io';

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONTEND_URL
    }
});

io.on('connection', (socket) => {
    console.log('conectado a socket.io')
 
    //Defenir los eventos de socket.io
    socket.on('abrir proyecto', (proyecto)=> {
        socket.join(proyecto);
    });

    socket.on('nueva tarea', (tarea) => {
        socket.to(tarea.proyecto).emit('tarea agregada', tarea);
    });

    socket.on('eliminar tarea', (tarea) => {
        socket.to(tarea.proyecto).emit('tarea eliminada', tarea);
    });

    socket.on('actualizar tarea', (tarea) => {
        socket.to(tarea.proyecto._id).emit('tarea actualizada', tarea);
    });

    socket.on('cambiar estado', (tarea) => {
        socket.to(tarea.proyecto._id).emit('nuevo estado', tarea);
    })
});