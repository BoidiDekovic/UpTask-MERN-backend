import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import { isValidObjectId } from 'mongoose';

const agregarTarea = async (req, res) => {
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if(!existeProyecto) {
        const error = new Error("El Proyecto no existe");
        return res.status(404).json({ msg: error.message });
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos");
        return res.status(403).json({ msg: error.message});
    }

    try {
        const tareaGuardada = await Tarea.create(req.body);
        existeProyecto.tareas.push(tareaGuardada._id)
        await existeProyecto.save();
        res.json(tareaGuardada);
    } catch (error) {
        console.log(error)
    }
};

const obtenerTarea = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg:error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg:error.message});
    }

    res.json(tarea);
};

const actualizarTarea = async (req, res) => {
    const { id } = req.params;

    

    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg:error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg:error.message});
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaGuardada = await tarea.save();
        res.json(tareaGuardada);
    } catch (error) {
        console.log(error)
    }

};

const eliminarTarea = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Id invalido' });
      }

    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg:error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg:error.message});
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)

        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);

        res.json({ msg: 'La tarea se Elimino'})
    } catch (error) {
        console.log(error);
    }

};

const cambiarEstado = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate('proyecto');

    if(!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg: error.message });
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && 
    !tarea.proyecto.colaboradores.some((colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
    ){
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg:error.message});
    }
    tarea.estado = !tarea.estado;
    tarea.completado = req.usuario._id;
    await tarea.save(); 

    const tareaGuardada = await Tarea.findById(id).populate('proyecto').populate('completado');

    res.json(tareaGuardada);
};

export{
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
};