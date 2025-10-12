import express from 'express';
import { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employee.js';


const router = express.Router();

router.get('/', getAllEmployees);

router.post('/', createEmployee);
   
router.get('/:id', getEmployee);

router.put('/:id', updateEmployee);
    
router.delete('/:id', deleteEmployee);

export default router;