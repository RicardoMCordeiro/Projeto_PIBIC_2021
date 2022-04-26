import { Form } from "react-bulma-components";


export default function Dropdown({ name, label, value, options, onChange }) {
  return (
    <Form.Control>
      <Form.Field>
        <Form.Label>{label}</Form.Label>
        <Form.Select name={name} value={value} onChange={onChange}>
          {options.map((op) => (
            <option key={`opt-${op}`} value={op}>
              {op}
            </option>
          ))}
        </Form.Select>
      </Form.Field>
    </Form.Control>
  );
}