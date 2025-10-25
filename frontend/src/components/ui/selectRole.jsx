import React from 'react'
import { Portal, Select, createListCollection } from "@chakra-ui/react"

const SelectRole = ({setInfo, value}) => {
  return (
    <Select.Root collection={roles} size="sm" width="320px" value={value ? [value] : undefined}
    onValueChange={(e) => {setInfo((prev) => ({...prev, role: e.value[0]}))}}>
      <Select.HiddenSelect />
      <Select.Label>Select role</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select role" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content className="select">
            {roles.items.map((role) => (
              <Select.Item item={role} key={role.value}>
                {role.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
)}

const roles = createListCollection({
  items: [
    { label: "HR", value: "HR" },
    { label: "Developer", value: "Developer" },
    { label: "Manager", value: "Manager" },
    { label: "Sales", value: "Sales" },
    { label: "Intern", value: "Intern" },
  ],
});




export default SelectRole
