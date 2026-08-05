import styled from "styled-components";



function PolicyList({ policies, onDownload, onDelete }) {
  if (policies.length === 0) {
    return <EmptyState>No policy files uploaded yet.</EmptyState>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Filename</Th>
          <Th>Size</Th>
          <Th>Uploaded</Th>
          <Th></Th>
        </tr>
      </thead>
      <tbody>
        {policies.map((p) => (
          <tr key={p.id}>
            <Td>{p.filename}</Td>
            <Td>{p.size_bytes} bytes</Td>
            <Td>{new Date(p.created_at).toLocaleString()}</Td>
            <Td>
              <ActionButton onClick={() => onDownload(p)}>Download</ActionButton>
              <ActionButton $danger onClick={() => onDelete(p)}>Delete</ActionButton>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  border-bottom: 2px solid #e0e0e0;
  font-size: 13px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  margin-right: 6px;
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid #d0d0d0;
  background: ${(props) => (props.$danger ? "#fdecea" : "#fff")};
  color: ${(props) => (props.$danger ? "#c0392b" : "#333")};
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }
`;

const EmptyState = styled.p`
  color: #888;
  font-size: 14px;
  margin-top: 16px;
`;

export default PolicyList;