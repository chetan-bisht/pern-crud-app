import React from 'react';
import {
  Button,
  CloseButton,
  Dialog,
  For,
  HStack,
  VStack,
  Input,
  Portal,
} from "@chakra-ui/react";
import {Field} from './field.jsx';
import SelectRole from './selectRole.jsx';
import { useState } from 'react';
import {toast} from 'react-hot-toast';
import {QueryClient, useMutation} from '@tanstack/react-query';
import { baseUrl } from '../../../constants/globalVariable.js';
import { queryClient } from '../../../utils/queryClient.js';

// InputEmployee component for adding a new employee
const InputEmployee = () => {

  const [info, setInfo] = useState({name: '', email: '', age: '', salary: '', role: ''});
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setInfo((prev) => ({...prev, [e.target.name]: e.target.value}));
  }
  console.log(info);

  const mutation = useMutation({
    mutationFn: async (info) => {
      // Ensure proper data types
      const submissionData = {
        ...info,
        age: parseInt(info.age, 10),
        salary: parseFloat(info.salary)
      };

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not add employee');
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      setOpen(false);
      toast.success('Employee added successfully!');
      queryClient.invalidateQueries({ queryKey: ['employee_details'] });
      // Reset form after successful submission
      setInfo({name: '', email: '', age: '', salary: '', role: ''});
    }
  });

  const requiredFields = ['name', 'email', 'age', 'salary', 'role'];
  function handleSubmit() {
    // Validate all required fields
    for (const key of requiredFields) {
      if (!info[key].trim()) {
        toast.error(`Please fill in the ${key} field.`);
        return;
      }
    }

    // If all fields are filled, proceed with submission
    console.log('Submitting employee data:', info);
    mutation.mutate({...info, role: info.role || null});
  }

  return (
    <Dialog.Root
      placement="center"
      motionPreset="slide-in-bottom"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline">Add Employee</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add Employee</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap="4" alignItems="flex-start">

                <Field label='Username' required>
                    <Input name='name' placeholder='Enter username' value={info.name} onChange={handleChange}/>
                </Field>

                <Field label='Email' required>
                    <Input name='email' placeholder='Enter email' value={info.email} onChange={handleChange}/>
                </Field>

                <Field label='Age' required>
                    <Input name='age' placeholder='Enter age' type='number' value={info.age} onChange={handleChange}/>
                </Field>

                <Field label='Salary' required>
                    <Input name='salary' placeholder='Enter salary' value={info.salary} onChange={handleChange}/>
                </Field>

                      <SelectRole setInfo={setInfo} value={info.role}/>
              </VStack>

            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleSubmit}>Add</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default InputEmployee
