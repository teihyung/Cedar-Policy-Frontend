import styled from "styled-components";

function TenantSelector({ tenants, selectedTenantId, onChange }) {
  return (
    <select
      value={selectedTenantId || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      {tenants.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}

const Select = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  background: #fff;
  min-width: 220px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4a72d6;
  }
`;

export default TenantSelector;