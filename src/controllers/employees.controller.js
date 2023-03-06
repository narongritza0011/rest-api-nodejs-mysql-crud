import { pool } from '../db.js';

export const getEmployees = async(req, res) => {
    try {
        // throw new Error('DB Error')
        const [rows] = await pool.query('SELECT * FROM employee')
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const getEmployeesById = async(req, res) => {

    try {
        const id = req.params.id
        const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [id])
        if (rows.length <= 0) return res.status(404).json({
            message: 'Employee not found'
        })
        res.json(rows[0])
        console.log(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}


export const createEmployee = async(req, res) => {
    try {
        const { name, salary } = req.body
        const [rows] = await pool.query('INSERT INTO employee(name, salary) VALUES (?,?)', [name, salary])

        // console.log(req.body)
        // res.send({ rows })
        res.send({
            id: rows.insertId,
            name,
            salary,
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const updateEmployee = async(req, res) => {
    const { id } = req.params
    const { name, salary } = req.body
    try {
        const [result] = await pool.query('UPDATE employee SET name = IFNULL(?,name),salary = IFNULL(?,salary) WHERE id = ?', [name, salary, id])

        console.log(result)

        if (result.affectedRows === 0) return res.status(404).json({
            message: "Employee not found"
        })

        const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [id])

        res.json(rows[0])
            // console.log(result)
            // res.json('update')
            // console.log(id, name, salary)
            // res.json('update')
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const deleteEmployee = async(req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM  employee WHERE id = ?', [req.params.id])
        if (result.affectedRows <= 0) return res.status(404).json({
                message: 'Employee not found'
            })
            // console.log(result)
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}