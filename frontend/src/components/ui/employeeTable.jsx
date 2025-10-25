import React, { useState } from 'react'
import { HStack, Stack, Table } from "@chakra-ui/react"
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useMutation } from '@tanstack/react-query';
import { baseUrl } from '../../../constants/globalVariable.js';
import toast from 'react-hot-toast';
import { queryClient } from '../../../utils/queryClient';
import {
  Dialog,
  Button,
  VStack,
  Input,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { Field } from './field.jsx';
import SelectRole from './selectRole.jsx';
const EmployeeTable = ({data}) => {
  const [editEmployee, setEditEmployee] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({name: '', email: '', age: '', salary: '', role: ''});

  // Handle edit icon click - populate form with employee data
  const handleEditClick = (employee) => {
    setEditEmployee(employee);
    setEditFormData({
      name: employee.name,
      email: employee.email,
      age: employee.age.toString(),
      salary: employee.salary.toString(),
      role: employee.role
    });
    setEditOpen(true);
  };

  // Handle form field changes
  const handleEditFormChange = (e) => {
    setEditFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    if (!editEmployee) return;

    // Validate required fields
    const requiredFields = ['name', 'email', 'age', 'salary', 'role'];
    for (const key of requiredFields) {
      if (!editFormData[key].trim()) {
        toast.error(`Please fill in the ${key} field.`);
        return;
      }
    }

    updateMutation.mutate({
      id: editEmployee.id,
      employeeData: {
        ...editFormData,
        age: parseInt(editFormData.age, 10),
        salary: parseFloat(editFormData.salary)
      }
    });
  };

  if (!data || data.length === 0) {
    return <h1>No data available</h1>
  }
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(baseUrl + '/' + id, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
      },
      onError: (error) => {
        console.log(error.message);
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success('Employee deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['employee_details'] });
      },
  });

  const updateMutation = useMutation({
    mutationFn: async ({id, employeeData}) => {
      const response = await fetch(baseUrl + '/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not update employee');
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Employee updated successfully');
      queryClient.invalidateQueries({ queryKey: ['employee_details'] });
      setEditOpen(false);
      setEditEmployee(null);
    },
  });
  return (
    <Stack gap="10">
      <Table.Root size="md" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Age</Table.ColumnHeader>
            <Table.ColumnHeader>Role</Table.ColumnHeader>
            <Table.ColumnHeader>Salary</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.age}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
              <Table.Cell>{item.salary}</Table.Cell>
              <Table.Cell>
                <HStack gap = "3">
                  <MdDelete size = {20} className='icon'
                  onClick={() => deleteMutation.mutate(item.id)} />
                  <FaEdit size = {20} className='icon'
                  onClick={() => handleEditClick(item)} />
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Edit Employee Dialog */}
      <Dialog.Root
        open={editOpen}
        onOpenChange={(e) => setEditOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Employee</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap="4" alignItems="flex-start">
                  <Field label='Username' required>
                    <Input
                      name='name'
                      placeholder='Enter username'
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                    />
                  </Field>

                  <Field label='Email' required>
                    <Input
                      name='email'
                      placeholder='Enter email'
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                    />
                  </Field>

                  <Field label='Age' required>
                    <Input
                      name='age'
                      placeholder='Enter age'
                      type='number'
                      value={editFormData.age}
                      onChange={handleEditFormChange}
                    />
                  </Field>

                  <Field label='Salary' required>
                    <Input
                      name='salary'
                      placeholder='Enter salary'
                      value={editFormData.salary}
                      onChange={handleEditFormChange}
                    />
                  </Field>

                  <SelectRole setInfo={setEditFormData} value={editFormData.role} />
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={handleEditSubmit}>Update</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Stack>
  )
}

export default EmployeeTable
