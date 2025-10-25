import React from 'react'
import EmployeeTable from './components/ui/employeeTable';
import { VStack } from "@chakra-ui/react"
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from '../constants/globalVariable.js';
import InputEmployee from './components/ui/inputEmployee.jsx';

const App = () => {
  
  async function fetchEmployeeDetails() {
    console.log('Attempting to fetch from:', baseUrl);
    try {
      const res = await fetch(baseUrl);
      console.log('Response status:', res.status, res.statusText);
      if (!res.ok) {
        const errorData = await res.text();
        console.log('Error response data:', errorData);
        throw new Error(`HTTP ${res.status}: ${errorData || 'Failed to fetch employee details'}`);
      }
      const data = await res.json();
      console.log('Fetched data:', data);
      return data;
    } catch (error) {
      console.log('Fetch error:', error);
      throw error;
    }
  }

  const {isPending, isError, data, error} = useQuery({
    queryKey : ["employee_details"],
    queryFn : fetchEmployeeDetails
  });

  if (isPending) return "Loading...";

  if (isError) return error.message;

  console.log("data from postgres:", data);
  return (
    <VStack gap="6" align="flex-start">
      <InputEmployee />
      <EmployeeTable data={data}/>
    </VStack>
  );
};



export default App
