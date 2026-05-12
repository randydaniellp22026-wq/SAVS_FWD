const { Usuario, Rol } = require('../models');
const bcrypt = require('bcrypt');

exports.getAll = async (req, res) => {
    try {
        const data = await Usuario.findAll({ 
            attributes: { exclude: ['password'] },
            include: [{ model: Rol, as: 'rol' }] 
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await Usuario.findByPk(req.params.id, { 
            attributes: { exclude: ['password'] },
            include: [{ model: Rol, as: 'rol' }] 
        });
        if (data) res.json(data);
        else res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const userData = { ...req.body };
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }
        const data = await Usuario.create(userData);
        const result = data.toJSON();
        delete result.password;
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const userData = { ...req.body };
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }
        const [updated] = await Usuario.update(userData, { where: { id: req.params.id } });
        if (updated) {
            const data = await Usuario.findByPk(req.params.id, {
                attributes: { exclude: ['password'] }
            });
            res.json(data);
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Usuario.destroy({ where: { id: req.params.id } });
        if (deleted) res.json({ message: 'Eliminado correctamente' });
        else res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
