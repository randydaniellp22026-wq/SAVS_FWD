const { Setting } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const data = await Setting.findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByKey = async (req, res) => {
    try {
        const data = await Setting.findOne({ where: { key: req.params.key } });
        if (data) res.json(data.value);
        else res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrUpdate = async (req, res) => {
    try {
        const { key, value } = req.body;
        const [setting, created] = await Setting.findOrCreate({
            where: { key },
            defaults: { value }
        });
        
        if (!created) {
            setting.value = value;
            await setting.save();
        }
        
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
