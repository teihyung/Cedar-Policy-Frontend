import { useState } from "react";
import styled from "styled-components";



function PolicyUploadForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await onUpload(file);
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <input type="file" accept=".cedar" onChange={(e) => setFile(e.target.files[0])} />
        <SubmitButton type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload policy"}
        </SubmitButton>
      </Form>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 16px;
  background: #f7f8fa;
  border-radius: 8px;
`;

const SubmitButton = styled.button`
  padding: 7px 16px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  background: #4a72d6;
  color: #fff;
  cursor: pointer;

  &:disabled {
    background: #b0bcd8;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #c0392b;
  font-size: 13px;
  margin: 8px 0 0;
`;

export default PolicyUploadForm;