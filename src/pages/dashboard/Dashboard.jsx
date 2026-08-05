import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { useAuth } from "../../AuthContext";
import {listTenants } from "../../api";
import TenantSelector from "./components/TenantSelector";
import PolicyUploadForm from "./components/PolicyUploadForm";
import PolicyList from "./components/PolicyList";
import { listPolicyFiles, uploadPolicyFile, downloadPolicyFile, deletePolicyFile } from "../../api";


function Dashboard() {
  const { token, logout } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    listTenants(token).then(setTenants).catch(console.error);
  }, [token]);

  useEffect(() => {
    if (tenants.length > 0 && !selectedTenantId) {
      setSelectedTenantId(tenants[0].id);
    }
  }, [tenants]);

  const refreshPolicies = () => {
    if (!selectedTenantId) return;
    listPolicyFiles(token, selectedTenantId).then(setPolicies).catch(console.error);
  };

  useEffect(() => {
    refreshPolicies();
  }, [selectedTenantId]);

  const handleUpload = async (file) => {
    await uploadPolicyFile(token, selectedTenantId, file);
    refreshPolicies();
  };

  const handleDownload = (policy) => {
    downloadPolicyFile(token, selectedTenantId, policy.id, policy.filename);
  };

  const handleDelete = async (policy) => {
    if (!window.confirm(`Delete ${policy.filename}?`)) return;
    await deletePolicyFile(token, selectedTenantId, policy.id);
    refreshPolicies();
  };

  return (
    <Page>
      <Header>
        <Title>SmartVerify policy files</Title>
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </Header>

      <Toolbar>
        <TenantSelector tenants={tenants} selectedTenantId={selectedTenantId} onChange={setSelectedTenantId} />
      </Toolbar>

      <PolicyUploadForm onUpload={handleUpload} />
      <PolicyList policies={policies} onDownload={handleDownload} onDelete={handleDelete} />
    </Page>
  );
}

const Page = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 20px;
  margin: 0;
`;

const LogoutButton = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
  background: #fff;
  cursor: pointer;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export default Dashboard;