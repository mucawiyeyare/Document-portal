import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { UploadCloud, File, Trash2, AlertCircle } from 'lucide-react';

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files');
      setFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first by clicking "Choose File"');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (subject.trim()) {
      formData.append('subject', subject.trim());
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('File uploaded successfully!');
      setFile(null);
      setSubject('');
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      fetchFiles();
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg && typeof err.response?.data === 'string') {
        // Strip HTML tags if backend returned an HTML error page
        const match = err.response.data.match(/<pre>([\s\S]*?)<\/pre>/i) || err.response.data.match(/<title>([\s\S]*?)<\/title>/i);
        msg = match ? match[1].replace(/&#39;/g, "'").trim() : 'Upload failed. Please check permissions or file size.';
      }
      setError(msg || 'Upload failed. Check file type restrictions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await api.delete(`/files/${id}`);
      fetchFiles();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="admin-grid">
      <div className="glass card-container" style={{ height: 'fit-content' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
          <UploadCloud /> Upload New File
        </h2>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', wordBreak: 'break-word', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }}/>
            <span>{error}</span>
          </div>
        )}
        {success && <div style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#86efac', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid rgba(34, 197, 94, 0.3)' }}>{success}</div>}

        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="Document Subject / Title (Optional)" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              style={{ width: '100%' }}
            />
          </div>
          <input 
            id="file-input"
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xlsx,.pptx"
            style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', width: '100%', marginBottom: '0.5rem' }}
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Allowed types: PDF, Word, Excel, PPT, Images. Max 50MB.
          </p>
          <button type="submit" className="btn" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>

      <div className="glass card-container">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Managed Files ({files.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {files.map(f => (
            <div key={f._id} className="file-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, overflow: 'hidden' }}>
                <File color="var(--primary)" size={24} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={f.originalName}>
                    {f.originalName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(f.uploadDate).toLocaleDateString()} • {f.fileType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                  </div>
                </div>
              </div>
              <div className="file-list-actions">
                <button onClick={() => window.open(`/view/${f._id}`, '_blank')} className="btn" style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.25)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>View</span>
                </button>
                <button onClick={() => handleDelete(f._id)} className="btn-danger" style={{ padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {files.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No files uploaded yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
