import { query } from "../utils/connectToDb.js";
import {
    createRoleQuery,
    createEmployeeTableQuery,
    resetEmployeeSequenceQuery,
    getAllEmployeesQuery,
    createEmployeeQuery,
    getEmployeeQuery,
    deleteEmployeeQuery,
    updateEmployeeQuery
} from "../utils/sqlQuery.js";
import { createError } from "../utils/error.js";

export async function getAllEmployees(req, res, next) {
    try {
        const tableCheck = await query(`SELECT to_regclass('employee_details')`);//check if table exists
        console.log('Table check result:', tableCheck.rows[0]);

        const typeCheck = await query(`SELECT to_regtype('role_type')`);//check if type exists
        console.log('Type check result:', typeCheck.rows[0]);

        if (!tableCheck.rows[0].to_regclass){//table does not exist
            console.log('Table does not exist, attempting to create type and table');
            if (!typeCheck.rows[0].to_regtype) {
                await query(createRoleQuery);
                console.log('Type created successfully');
            } else {
                console.log('Type already exists, skipping creation');
            }
            await query(createEmployeeTableQuery);
            console.log('Table created successfully');
        } else {
            console.log('Table already exists');
        }

        const {rows} = await query(getAllEmployeesQuery);
        res.status(200).json(rows);
        
    } catch (error) {
        console.log(error.message);
        return next(createError(400, "Could not fetch employee details!"));
    }
}

export async function getEmployee(req, res, next) {
    const id = req.params.id;
    const data = await query(getEmployeeQuery, [id]);
    console.log(data);
    if(!data.rows.length) {
        return next(createError(404, "Employee not found"));
    }
    res.status(200).json(data.rows[0]);
    
}

export async function createEmployee(req, res, next) {
     try {
        if (!req.body) {
            return res.status(400).json({ error: "Request body is required" });
        }

        const { name, email, age, role, salary } = req.body;
        if (!name || !email || !age || !salary) {
            return res.status(400).json({ error: "Missing required fields: name, email, age, and salary are required" });
        }

        // Validate data types
        if (typeof age !== 'number' || age <= 18) {
            return res.status(400).json({ error: "Age must be a number greater than 18" });
        }

        if (typeof salary !== 'number' || salary <= 0) {
            return res.status(400).json({ error: "Salary must be a positive number" });
        }

        // Check if table is empty before resetting sequence
        const existingEmployees = await query(getAllEmployeesQuery);
        if (existingEmployees.rows.length === 0) {
            // Reset sequence only if table is empty to ensure it starts from 1
            await query(resetEmployeeSequenceQuery);
        }

        const data = await query(createEmployeeQuery, [name, email, age, role, salary]);
        res.status(201).json(data.rows[0]);
     } catch (error) {
        console.log('Create employee error:', error.message);
        return next(createError(500, "Could not create employee!"));
    }
}

export async function updateEmployee(req, res, next) {
    try{
        const id = req.params.id;
        const {name, email, age, role, salary} = req.body;
        const result = await query(updateEmployeeQuery, [name, email, age, role, salary, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch(error) {
        return next(createError(400, "Could not update employee"));
    }
}

export async function deleteEmployee(req, res, next) {
    
    const id = req.params.id;
    const data = await query(deleteEmployeeQuery, [id]);
    console.log(data);
    if(data.rowCount === 0) {
        return next(createError(404, "Employee not found"));
    }
    res.status(200).json("Employee deleted successfully");
}
