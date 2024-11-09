import { emptyOrRows } from '../helpers/utils.js';
import selectAllTasks from './models/Task.js';

const getTasks = async (req, res, next) => {
    try {
        const result = await selectAllTasks()
        return res.status(200).json(emptyOrRows(result))
    } catch(error) {
        return next(error)
    }
}

